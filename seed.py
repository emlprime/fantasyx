import hashlib
from alembic import op
from datetime import date
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Date, MetaData, create_engine
from sqlalchemy.orm import Session
import json
import csv
from models import Character, User, Draft

# Create an ad-hoc table to use for the insert statement.
engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)

session.execute("TRUNCATE TABLE character restart identity CASCADE")
session.execute("TRUNCATE TABLE draft restart identity CASCADE")
session.execute('TRUNCATE TABLE "user" restart identity CASCADE')
session.commit()

with open('data/seeds/character.csv') as data_file:
    characters = [dict(character) for character in csv.DictReader(data_file)]
    # print(characters)
    session.execute(Character.__table__.insert(), characters)
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


print(user.as_dict())
user = session.query(User).limit(1).offset(1).first()
print(user.as_dict())
# print(character)



