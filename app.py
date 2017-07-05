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

import json
# You must configure these 3 values from Google APIs console
# https://code.google.com/apis/console
GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_CLIENT_SECRET = os.environ['GOOGLE_CLIENT_SECRET']
REDIRECT_URI = '/oauth2callback'  # one of the Redirect URIs from Google APIs console
 
SECRET_KEY = 'development key'
DEBUG = True
 
app = Flask(__name__)
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
                          consumer_key=GOOGLE_CLIENT_ID,
                          consumer_secret=GOOGLE_CLIENT_SECRET,
                          
)

engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
db_session = Session(bind=engine)
users = {}

@app.route('/')
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
    
    return redirect('http://localhost:3000/user/%s' % user.identifier)
 
 
@app.route('/login')
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

@websocket.route('/test')
def test(ws):
    users[ws.id] = ws
    print("first get user")
    print(ws)
    print("================")
    
    while True:
        msg = ws.receive()
        if msg:
            print("message: %s" % msg)
            decoded_msg = json.loads(msg)
            msg_type = decoded_msg['type']
            if msg_type:
                try:
                    response = handle_event(msg_type, decoded_msg, db_session)
                    
                    
                    print("================================================================")
                    if msg_type in ['user_data', 'my_drafts', 'release']:
                        if msg_type == 'user_data':
                            users[decoded_msg['user_identifier']] = ws
                            del users[ws.id]
                            print users
                        ws.send(response)
                        if msg_type == 'release':
                            available_characters = handle_event('available_characters', decoded_msg, db_session)
                            for user in users.values():
                                user.send(available_characters)
                    else:
                        for user_identifier, user in users.items():
                            user.send(handle_event('can_draft', {'user_identifier': user_identifier}, db_session))
                            user.send(response)
                            
                except Exception as error:
                    user.send({"error": error.args[0]})
                        
    del users[ws.id]

def main():
    app.run(gevent=100, debug=True, host='0.0.0.0')
 
if __name__ == '__main__':
    main()    
