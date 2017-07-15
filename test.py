from fantasyx import app, db_session, redis
from fantasyx.models import DraftTicket, User, Rubric
from fantasyx.game import rubric
# print db_session.query(User).count()
# print db_session.query(DraftTicket).count()

user = db_session.query(User).first()

print user.can_draft(db_session)
# rubric = db_session.query(Rubric).first()
# print rubric.description
# print rubric({}, db_session)

# from random import shuffle
# users = ["elaina", "ted", "vernon", "shayna", "kris", "otherkris", "nick", "lauren"]
# shuffle(users)

# print users
# ['ted', 'elaina', 'otherkris', 'vernon', 'kris', 'lauren', 'nick', 'shayna']
# emlprime,emlprime@gmail.com,Peter,Stradinger,Strife, Beach,erdfd.png
