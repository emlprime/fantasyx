import hashlib
from alembic import op
from datetime import date
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Date, MetaData, create_engine
from sqlalchemy.orm import Session
import json
import csv
from models import Character, User, Draft, DraftTicket, Episode, Rubric

# Create an ad-hoc table to use for the insert statement.
engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)

session.execute("TRUNCATE TABLE character restart identity CASCADE")
session.execute("TRUNCATE TABLE draft restart identity CASCADE")
session.execute("TRUNCATE TABLE draft_ticket restart identity CASCADE")
session.execute('TRUNCATE TABLE "user" restart identity CASCADE')
session.execute('TRUNCATE TABLE episode restart identity CASCADE')
session.execute('TRUNCATE TABLE rubric restart identity CASCADE')
session.execute('TRUNCATE TABLE score restart identity CASCADE')
session.commit()

seeds = {
    Character: 'character',
    Episode: 'episode',
    Rubric: 'rubric',
}

for klass, filename in seeds.items():
    with open('data/seeds/%s.csv' % (filename)) as data_file:
        records = [dict(record) for record in csv.DictReader(data_file)]
        session.execute(klass.__table__.insert(), records)
        session.commit()
    
with open('data/seeds/user.csv') as data_file:
    users = [dict(user) for user in csv.DictReader(data_file)]
    for user in users:
        email = user['email']
        user['identifier'] = hashlib.sha224(email).hexdigest()
    session.execute(User.__table__.insert(), users)
    session.commit()

user = session.query(User).first()
character = session.query(Character).first()

user_identifiers = [user_identifier for user_identifier in session.query(User).values(User.identifier)]

draft_tickets = []

iterator = 0
for x in xrange(20):
    for i, user_identifier in enumerate(user_identifiers):
        iterator += 1
        draft_tickets.append({"user_identifier": user_identifier, "sort": iterator})
    user_identifiers = list(reversed(user_identifiers))

session.execute(DraftTicket.__table__.insert(), draft_tickets)
session.commit()

print(user.as_dict())
user = session.query(User).limit(1).offset(1).first()
print(user.as_dict())
# print(character)



