import os
from flask import Flask, redirect, url_for, session, redirect, jsonify, request
from flask_oauth import OAuth
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, Load
from models import Character, User, Draft
from flask_socketio import SocketIO, emit

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
socketio = SocketIO(app)
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

@app.route('/api/v1/user/<user_identifier>')
@cross_origin(origin='*')
def user(user_identifier):
    print("user identifier:%s" % user_identifier)
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    return jsonify({"email": user.email})

@app.route('/api/v1/characters')
@cross_origin(origin='*')
def characters():
    result = db_session.query(Character).values(Character.id, Character.name)
    return jsonify(characters=[{"id": item[0], "name": item[1]} for item in result if item[0]])

@app.route('/api/v1/available_characters')
@cross_origin(origin='*')
def available_characters():
    result = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).values(Character.id, Character.name)
    return jsonify(characters=[{"id": item[0], "name": item[1]} for item in result if item[0]])

@app.route('/api/v1/my_drafts/<user_identifier>')
@cross_origin(origin='*')
def my_drafts(user_identifier):
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with name %s" % user_identifier)
    return jsonify(characters=[{"id": character.id, "name": character.name} for character in user.characters.values()])

@app.route('/api/v1/draft_list/<user_name>')
@cross_origin(origin='*')
def draft_list(user_name):
    user = db_session.query(User).filter(User.name==user_name).first()
    if not user:
        return jsonify([])
    drafts = user.draft_list()
    draft_result = [{"id": character.id, "name": character.name} for character in drafts]
    return jsonify(characters=draft_result)

@app.route('/api/v1/draft/<user_identifier>', methods=['POST'])
@cross_origin(origin='*')
def draft(user_identifier):
    data = json.loads(request.get_data(parse_form_data=True))
    character_id = data['character_id']

    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    character = db_session.query(Character).filter(Character.id == data['character_id']).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)
    print "Drafting %s for %s" % (character, user_identifier)
    user.draft(character)
    
    return jsonify(True)

@app.route('/api/v1/release/<user_identifier>', methods=['POST'])
@cross_origin(origin='*')
def release(user_identifier):
    data = json.loads(request.get_data(parse_form_data=True))
    character_id = data['character_id']

    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    character = db_session.query(Character).filter(Character.id == character_id).first()
    user.release(character)
    
    return jsonify(True)

def main():
    socketio.run(app, debug=True, host='0.0.0.0')
 
 
if __name__ == '__main__':
    main()    
