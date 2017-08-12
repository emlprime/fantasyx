from fantasyx import app, db_session, redis
from fantasyx.models import DraftHistory, User, Rubric, Episode, Score, Character
from sqlalchemy.orm import lazyload, joinedload
results = db_session.query(User).outerjoin(DraftHistory).outerjoin(Character).filter(User.name=='erife').values(User.id, DraftHistory.id, Character.name)

for result in results:
    print result


# import csv
# import hashlib


# for row in  db_session.query(Score).outerjoin(Character).outerjoin(User).order_by(Score.episode_number, Character.name).all():
#     print row.user
# import json
# import redis
# from datetime import datetime
# r = redis.Redis()
# message = "PDS was here again at %s" % datetime.now()
# clients = r.publish('msgs', json.dumps({"type": "NOTIFY", "message": message}))
# print clients








