import os
from collections import deque
from flask import Flask, redirect, url_for, session, redirect, jsonify, request
from flask_oauth import OAuth
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, Load
from models import Character, User, Draft, DraftTicket
from flask_uwsgi_websocket import GeventWebSocket
from game import handle_event, can_draft
from flask import Flask
from flask_dotenv import DotEnv
import json
import redis
import os


app = Flask(__name__)
env = DotEnv()
env_file = '/var/www/fantasyx/.env' if os.path.exists('/var/www/fantasyx/.env') else '.env'
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

@websocket.route('/api/test')
def test(ws):
    user_identifier = None
    while True:
        msg = ws.receive()
        if msg:
            decoded_msg = json.loads(msg)
            msg_type = decoded_msg['type']
            if msg_type:
                try:
                    if msg_type == 'scores':
                        response = handle_event(msg_type, decoded_msg, engine)
                        ws.send(response)
                    else:
                        response = handle_event(msg_type, decoded_msg, db_session)
                        
                        if msg_type in ['user_data', 'my_drafts', 'release']:
                            if msg_type == 'user_data':
                                user_identifier = decoded_msg['user_identifier']

                            ws.send(response)
                            if msg_type == 'release':
                                available_characters = handle_event('available_characters', decoded_msg, db_session)
                                for user in users.values():
                                    user.send(available_characters)
                        else:
                            if msg_type == 'release':
                                user.send(handle_event('can_draft', {'user_identifier': user_identifier}, db_session))
                                
                            for user_identifier, user in users.items():
                                user.send(handle_event('can_draft', {'user_identifier': user_identifier}, db_session))
                                user.send(response)
                                
                except Exception as error:
                    user.send({"error": error.args[0]})
                        
    if user_identifier:
        # unsubscribe user identifier
        pass

