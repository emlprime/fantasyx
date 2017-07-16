from fantasyx import app, db_session
from fantasyx.models import DraftHistory, DraftTicket, User

for row in db_session.query(DraftHistory).offset(37).all():
    print row
print "================================================================"    
for row in db_session.query(DraftTicket).all():
    print db_session.query(User).filter(User.identifier == row.user_identifier).first().name
    

