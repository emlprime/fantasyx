from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, Load
from models import Character
app = Flask(__name__)
CORS(app)
engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/v1/characters')
@cross_origin(origin='*')
def characters():
    result = session.query(Character).values(Character.id, Character.name)
    return jsonify(characters=[{"id": item[0], "name": item[1]} for item in result if item[0]])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', threaded=True)
