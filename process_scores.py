from fantasyx import app, db_session, engine
from fantasyx.models import DraftHistory, DraftTicket, User, Episode
from fantasyx.game import generate_score, scores
import csv

db_session.execute('TRUNCATE TABLE score restart identity CASCADE')
with open('fantasyx/data/seeds/score.csv') as data_file:
    for score in csv.DictReader(data_file):
        generate_score(dict(score), db_session)
        

print scores({"type":"scores"}, engine)

# for row in db_session.query(DraftHistory).offset(37).all():
#     print row
# print "================================================================"    
# for row in db_session.query(DraftTicket).all():
#     print db_session.query(User).filter(User.identifier == row.user_identifier).first().name



