import hashlib
from alembic import op
from datetime import date
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Date, MetaData, create_engine
from sqlalchemy.orm import Session
import json
import csv
from models import Character, User, Draft, DraftTicket, Episode, Rubric
from flask import Flask
from flask_dotenv import DotEnv
import os

app = Flask(__name__)
env = DotEnv()
env_file = '/var/www/fantasyx/.env' if os.path.exists('/var/www/fantasyx/.env') else '.env'
env.init_app(app, env_file=env_file, verbose_mode=True)
if app.config['FLASK_ENV'] == 'development':
    engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
else:
    engine=create_engine('postgresql://%(DB_USERNAME)s:%(DB_PASSWORD)s@%(DB_ENDPOINT)s:5432/fantasyx' % app.config)

db_session = Session(bind=engine)

db_session.execute("TRUNCATE TABLE character restart identity CASCADE")
db_session.execute("TRUNCATE TABLE draft restart identity CASCADE")
db_session.execute("TRUNCATE TABLE draft_ticket restart identity CASCADE")
db_session.execute('TRUNCATE TABLE "user" restart identity CASCADE')
db_session.execute('TRUNCATE TABLE episode restart identity CASCADE')
db_session.execute('TRUNCATE TABLE rubric restart identity CASCADE')
db_session.execute('TRUNCATE TABLE score restart identity CASCADE')
db_session.commit()

seeds = {
    Character: 'character',
    Episode: 'episode',
    Rubric: 'rubric',
}

for klass, filename in seeds.items():
    with open('data/seeds/%s.csv' % (filename)) as data_file:
        records = [dict(record) for record in csv.DictReader(data_file)]
        db_session.execute(klass.__table__.insert(), records)
        db_session.commit()
    
with open('data/seeds/user.csv') as data_file:
    users = [dict(user) for user in csv.DictReader(data_file)]
    for user in users:
        email = user['email']
        user['identifier'] = hashlib.sha224(email).hexdigest()
    db_session.execute(User.__table__.insert(), users)
    db_session.commit()

user = db_session.query(User).first()
character = db_session.query(Character).first()

user_identifiers = [user_identifier for user_identifier in db_session.query(User).values(User.identifier)]

draft_tickets = []

iterator = 0
for x in xrange(8):
    for i, user_identifier in enumerate(user_identifiers):
        iterator += 1
        draft_tickets.append({"user_identifier": user_identifier, "sort": iterator})
    user_identifiers = list(reversed(user_identifiers))

db_session.execute(DraftTicket.__table__.insert(), draft_tickets)
db_session.commit()

print(user.as_dict())
user = db_session.query(User).limit(1).offset(1).first()
print(user.as_dict())
# print(character)



