from sqlalchemy import func, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from models import Character, User, DraftHistory
from game import generate_score

Base = declarative_base()

engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)

msg = {
    'character_name': 'Daenerys Targaryen',
    'episode_number': 'S07E01',
    'rubric_description': 'Changed the course of an individual life',
    'bonus': 10,
    'notes': 'He invented cunnilingus'
}

character_name = msg['character_name']
character = session.query(Character).filter(Character.name == character_name).first()
    
user_identifier = 'ce59f778839e09c501bec59a88d5729d8b1648c085df592fa2b93030'
user = session.query(User).filter(User.identifier == user_identifier).first()

user.draft(character)
session.commit()

draft_history = DraftHistory(
    character_id=1,
    user_id=1,
    drafted_at='2017-07-13'
)
session.add(draft_history)
session.commit()

generate_score(msg, session)


