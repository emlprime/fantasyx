import os
from flask import Flask, redirect, url_for, session, redirect, jsonify, request
from flask_oauth import OAuth
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, Load
from models import Character, User, Draft
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
oauth = OAuth()
 
google = oauth.remote_app('google',
                          base_url='https://www.google.com/accounts/',
                          authorize_url='https://accounts.google.com/o/oauth2/auth',
                          request_token_url=None,
                          request_token_params={'scope': 'https://www.googleapis.com/auth/userinfo.email',
                                                'response_type': 'code',
                                                'access_type':'offline'
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
    except URLError as e:
        if e.code == 401:
            # Unauthorized - bad token
            session.pop('access_token', None)
            return redirect(url_for('login'))
        return res.read()
    
    try:
        import json
        import hashlib
        response = res.read()
        data = json.loads(response)
        email = data["email"]
    except ValueError:
        print("Could not parse json response from Google")
    
    user_identifier = hashlib.sha224(email).hexdigest()
    return redirect('http://localhost:3000?u=%s' % user_identifier)
 
 
@app.route('/login')
def login():
    callback=url_for('authorized', _external=True)
    return google.authorize(callback=callback)
 
 
 
@app.route(REDIRECT_URI)
@google.authorized_handler
def authorized(resp):
    access_token = resp['access_token']
    session['access_token'] = access_token, ''
    return redirect(url_for('index'))
 
 
@google.tokengetter
def get_access_token():
    return session.get('access_token')

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

@app.route('/api/v1/my_drafts/<user_name>')
@cross_origin(origin='*')
def my_drafts(user_name):
    user = db_session.query(User).filter(User.name == user_name).first()
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

@app.route('/api/v1/draft', methods=['POST'])
@cross_origin(origin='*')
def draft():
    data = json.loads(request.get_data(parse_form_data=True))
    username = data['user_name']
    character_id = data['character_id']

    user = db_session.query(User).filter(User.name == data['user_name']).first()
    character = db_session.query(Character).filter(Character.id == data['character_id']).first()
    user.draft(character)
    
    return jsonify(True)

@app.route('/api/v1/release', methods=['POST'])
@cross_origin(origin='*')
def release():
    data = json.loads(request.get_data(parse_form_data=True))
    username = data['user_name']
    character_id = data['character_id']

    user = db_session.query(User).filter(User.name == data['user_name']).first()
    character = db_session.query(Character).filter(Character.id == data['character_id']).first()
    user.release(character)
    
    return jsonify(True)

def main():
    app.run(debug=True, host='0.0.0.0', threaded=True)
 
 
if __name__ == '__main__':
    main()    
