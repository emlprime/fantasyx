from fantasyx import app, db_session, redis
from fantasyx.models import DraftTicket, User, Rubric, Episode
from fantasyx.game import rubric, raw_scores
import csv
import hashlib

data = {
    "name": 'peter',
    "seat_of_power": 'foo',
    "house_words": 'bar',
}

print db_session.query(User).filter(User.name == data['name']).update(data)

# db_session.commit()
