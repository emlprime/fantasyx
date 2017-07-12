from fantasyx import app, db_session, redis
from fantasyx.models import DraftTicket
print db_session.query(DraftTicket).count()
