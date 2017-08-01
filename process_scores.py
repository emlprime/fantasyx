from fantasyx import app, db_session, engine
from fantasyx.models import DraftHistory, DraftTicket, User, Episode
from fantasyx.game import generate_score, scores
import csv

# db_session.execute('TRUNCATE TABLE score restart identity CASCADE')

# db_session.commit()

episodes = [
    # 'S07E01',
    # 'S07E02',
    'S07E03',
]
for episode in episodes:
    with open('fantasyx/data/episode_scores/%s.csv' % episode) as data_file:
        for raw_score in csv.DictReader(data_file):
            score = dict(raw_score)
            score["episode_number"] = episode
            # print score
            generate_score(score, db_session)
        

# print scores({"type":"scores", }, engine)

# for row in db_session.query(DraftHistory).offset(37).all():
#     print row
# print "================================================================"    
# for row in db_session.query(DraftTicket).all():
#     print db_session.query(User).filter(User.identifier == row.user_identifier).first().name



