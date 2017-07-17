import hashlib
from alembic import op
from datetime import date
from sqlalchemy.sql import table, column
from sqlalchemy import String, Integer, Date, MetaData, create_engine, or_
from sqlalchemy.orm import Session
import json
import csv
from game import generate_score, scores
from models import Character, Episode, DraftHistory, User

# Create an ad-hoc table to use for the insert statement.
engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
db_session = Session(bind=engine)

db_session.execute('TRUNCATE TABLE score restart identity CASCADE')

episodes = [
    "S07E01",
    "S07E02",
]

for episode_number in episodes:
    with open('data/episode_scores/%s.csv' % (episode_number)) as data_file:
        records = [dict(record) for record in csv.DictReader(data_file)]
        for record in records:
            record['episode_number'] = episode_number
            generate_score(record, db_session)
            
db_session.commit()

print scores({}, engine)
