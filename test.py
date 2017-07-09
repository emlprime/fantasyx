from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from game import handle_event
from sqlalchemy.orm import Session

Base = declarative_base()
engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')

db_session = Session(bind=engine)

msg = {'type': 'scores'}

result = handle_event(msg['type'], msg, engine)

print result
