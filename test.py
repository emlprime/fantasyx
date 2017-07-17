from fantasyx import app, db_session, redis
from fantasyx.models import DraftTicket, User, Rubric
from fantasyx.game import rubric
import csv
import hashlib

with open('fantasyx/data/seeds/admin_users.csv') as data_file:
    users = [dict(user) for user in csv.DictReader(data_file)]
    for user in users:
        email = user['email']
        user['identifier'] = hashlib.sha224(email).hexdigest()
    db_session.execute(User.__table__.insert(), users)
    db_session.commit()

