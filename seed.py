from alembic import op
from datetime import date
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Date, MetaData, create_engine
from sqlalchemy.orm import Session
import json
import csv
from models import Character

# Create an ad-hoc table to use for the insert statement.
engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)

session.execute("TRUNCATE TABLE character restart identity CASCADE")
session.commit()

with open('data/seeds/character.csv') as data_file:
    characters = [dict(character) for character in csv.DictReader(data_file)]
    print(characters)
    session.execute(Character.__table__.insert(), characters)
    session.commit()
    
result = session.query(Character).count()
print(result)


