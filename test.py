from sqlalchemy import func, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from models import Character, User

Base = declarative_base()

engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)
result = session.query(Character).count()

user_name = 'peter'
peter = session.query(User).filter(User.name==user_name).first()
def draft(user_name, character_name):
    user = session.query(User).filter(User.name==user_name).first()
    character = session.query(Character).filter(Character.name==character_name).first()
    user.draft(character)
    session.commit()


print(peter.draft_list())
# draft('peter', 'Daario Naharis')

for character in session.query(Character).all():
    print "%s: %s" % (character, character.draftors)

