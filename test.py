from fantasyx import app, db_session, redis
from fantasyx.models import DraftTicket, User, Rubric, Episode, Score, Character
from sqlalchemy.orm import lazyload, joinedload


import csv
import hashlib


for row in  db_session.query(Score).outerjoin(Character).outerjoin(User).order_by(Score.episode_number, Character.name).all():
    print row.user
    




