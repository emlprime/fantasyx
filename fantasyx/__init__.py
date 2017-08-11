import os
from collections import deque
from flask import Flask, redirect, url_for, session, redirect, jsonify, request
from flask_oauth import OAuth
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, Load
from models import Character, User, Draft, DraftTicket
from flask_uwsgi_websocket import GeventWebSocket
from game import handle_event, initial_data, format_characters, format_can_draft, format_can_release
from flask import Flask
from flask_dotenv import DotEnv
import json
import redis
import os


app = Flask(__name__)
env = DotEnv()
env_file_path = [
    '.env',
    '../.env',
    '/var/www/fantasyx/.env',
]
for env_file_location in env_file_path:
    if os.path.exists(env_file_location):
        env_file = env_file_location
        break

env.init_app(app, env_file=env_file, verbose_mode=True)

# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
REDIRECT_URI = '/api/oauth2callback'  # one of the Redirect URIs from Google APIs console
 
SECRET_KEY = 'development key'
DEBUG = True
 
CORS(app)
app.debug = DEBUG
app.secret_key = SECRET_KEY
websocket = GeventWebSocket(app)
oauth = OAuth()
 
google = oauth.remote_app('google',
                          base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'code',
                                                'access_type':'offline',
                                                'prompt': 'consent'
                          },
                          access_token_url='https://accounts.google.com/o/oauth2/token',
                          access_token_method='POST',
                          access_token_params={'grant_type': 'authorization_code'},
                          consumer_key=app.config['GOOGLE_CLIENT_ID'],
                          consumer_secret=app.config['GOOGLE_CLIENT_SECRET'],
                          
)

if app.config['FLASK_ENV'] == 'development':
    engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
else:
    engine=create_engine('postgresql://%(DB_USERNAME)s:%(DB_PASSWORD)s@%(DB_ENDPOINT)s:5432/fantasyx' % app.config)

db_session = Session(bind=engine)

@app.route('/api/')
def index():
    print("in index")
    access_token = session.get('access_token')
    if access_token is None:
        return redirect(url_for('login'))
 
    access_token = access_token[0]
    from urllib2 import Request, urlopen, URLError
 
    headers = {'Authorization': 'OAuth '+access_token}
    req = Request('https://www.googleapis.com/oauth2/v1/userinfo',
                  None, headers)
    try:
        res = urlopen(req)
        print("response:", res)
    except URLError as e:
        if e.code == 401:
            # Unauthorized - bad token
            session.pop('access_token', None)
            return redirect(url_for('login'))
        return res.read()
    print("in passed the first try")

    try:
        import json
        response = res.read()
        data = json.loads(response)
        email = data["email"]
        user = db_session.query(User).filter(User.email==email).one()
        print(user.as_dict())
    except ValueError:
        print("Could not parse json response from Google")

    if app.config['FLASK_ENV'] == 'development':
        endpoint = 'localhost:3000'
    else:
        endpoint = 'lot.emlprime.com'
    return redirect('http://%s/user/%s' % (endpoint, user.identifier))
 
 
@app.route('/api/login')
def login():
    print("in login")
    callback=url_for('authorized', _external=True)
    return google.authorize(callback=callback)
 
 
 
@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    print("in authorized")
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('index'))
 
 
@google.tokengetter
def get_access_token():
    return session.get('access_token')

r = redis.Redis()

@websocket.route('/api/test')
def test(ws):
    user_identifier = None
    new_ws = True
    pubsub = r.pubsub()
    pubsub.subscribe(['msgs'])
    while True:
        msg = ws.receive()
        if msg:
            print "ws msg: %s" % msg
            msg = json.loads(msg)
            if new_ws and msg["type"] == "USER_IDENTIFIER" and "user_identifier" in msg.keys():
                user_identifier = msg["user_identifier"]
                print "%s logged in" % user_identifier
                new_ws = False
                for message in initial_data(user_identifier, db_session):
                    ws.send(json.dumps(message))
                r.publish("msgs", json.dumps({"type": "LOGIN", "username": "%s has logged in" % user_identifier}))
            else:
                response = handle_event(msg["type"], msg, db_session)
                if msg["type"] in ["DRAFT", "RELEASE"]:
                    r.publish('msgs', json.dumps({'type': 'CHARACTER_CHANGE', 'user_identifier': user_identifier, "message": response}))
                print "msg [%s] for %s" % (msg, user_identifier)
        else:
            submsg = pubsub.get_message()
            if submsg:
                print "pubsub msg [%s] for %s" % (submsg, user_identifier)
                if submsg["type"] == 'subscribe':
                    continue
                print submsg["data"]
                msg = json.loads(submsg["data"])
                print "a msg: %s" % msg
                print "message:(%s == %s) %s" % (msg["type"], "NOTIFY", str(msg["type"]) == "NOTIFY")

                if msg["type"] == "CHARACTER_CHANGE":
                    print "character changed we should update %s" % user_identifier
                    ws.send(json.dumps({"type": "NOTIFY", "message": msg["message"]}))
                    ws.send(json.dumps(format_characters(db_session)))
                    ws.send(json.dumps(format_can_draft(user_identifier, db_session)))
                    ws.send(json.dumps(format_can_release(user_identifier, db_session)))
                if msg["type"] == "NOTIFY":
                    print "notifying msg: %s" % msg["message"]
                    ws.send(json.dumps(msg))
            else:
                print "no pubsub for %s" % user_identifier


    if user_identifier:
        # unsubscribe user identifier
        print "unsubscribe user identifier"
        pubsub.unsubscribe(['msgs'])
        
