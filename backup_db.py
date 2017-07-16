from fantasyx import app, db_session
from fantasyx.models import DraftHistory, DraftTicket, User
import csv

with open('draft_history.csv', 'w') as csvfile:
    paperback_writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
    for draft_history in db_session.query(DraftHistory).all():
        paperback_writer.writerow([draft_history.character_id, draft_history.user_id, draft_history.drafted_at, draft_history.released_at])
    

