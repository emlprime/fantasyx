from fantasyx import app, db_session, engine
from fantasyx.models import DraftHistory, DraftTicket, User, Episode, Character
from fantasyx.game import generate_score
import csv


episodes = [
    'S07E01',
    'S07E02',
    'S07E03',
    'S07E04',
]
for episode in episodes:
    with open('fantasyx/data/episode_scores/%s.csv' % episode) as data_file:
        for raw_score in csv.DictReader(data_file):
            score = dict(raw_score)
            score["episode_number"] = episode
            if score["character_name"] != 'Tycho Nestoris':
                continue
            print score
            # generate_score(score, db_session)


# for row in db_session.query(DraftHistory).join(Character).filter(Character.name == 'Tycho Nestoris').all():
#     print row.id
#     print row.released_at
#     print "================"
# tycho =  db_session.query(DraftHistory).filter(DraftHistory.id == 46).one()
# tycho.released_at = '2017-07-23'
# db_session.commit()
    
    # print scores({"type":"scores", }, engine)

# for row in db_session.query(DraftHistory).offset(37).all():
#     print row
# print "================================================================"    
# for row in db_session.query(DraftTicket).all():
#     print db_session.query(User).filter(User.identifier == row.user_identifier).first().name



