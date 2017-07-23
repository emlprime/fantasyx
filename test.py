from fantasyx import app, db_session, redis
from fantasyx.models import DraftTicket, User, Rubric, Episode
from fantasyx.game import rubric, raw_scores
import csv
import hashlib

# with open('fantasyx/data/seeds/admin_users.csv') as data_file:
#     users = [dict(user) for user in csv.DictReader(data_file)]
#     for user in users:
#         email = user['email']
#         user['identifier'] = hashlib.sha224(email).hexdigest()
#     db_session.execute(User.__table__.insert(), users)
#     db_session.commit()


# user = db_session.query(User).first()
# print "count: %d" % user.count_of_draft_tickets(db_session)
# print "next draft: %s" % 
# for episode in db_session.query(Episode).all():
#     print episode

# print "================"
# print user.id
# print user.is_not_episode_blackout(db_session)
# print user.draft_allowed(db_session)
# print user.empty_slots()
# print "================"

    
# print user.empty_slots(db_session)

msg = {"options": {"canon": "altfacts"}}
print raw_scores(msg, db_session)
