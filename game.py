import json
from models import Character, User, Draft

def handle_event(msg_type, msg, db_session=None):
    print("handling %s" % msg_type)
    handlers = {
        "draft": draft,
        "my_drafts": my_drafts,
        "characters": characters,
        "available_characters": available_characters,
        "draft": draft,
        "release": release,
        "user_data": user_data
    }
    if msg_type in handlers.keys():
        
        response = handlers[msg_type](msg, db_session)
    else:
        response = {"error": "no handler implemented for %s" % msg_type}
    return json.dumps(response)


def characters(msg, db_session):
    result = db_session.query(Character).values(Character.id, Character.name)
    return {"characters": [{"id": item[0], "name": item[1]} for item in result if item[0]]}

def user_data(msg, db_session):
    user_identifier = msg['user_identifier']
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    return {"user_data": {"email": user.email}}

def available_characters(msg, db_session):
    result = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).values(Character.id, Character.name)
    return {"available_characters": [{"id": item[0], "name": item[1]} for item in result if item[0]]}

def my_drafts(msg, db_session):
    user_identifier = msg['user_identifier']
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with name %s" % user_identifier)
    return {"my_drafts": [{"id": draft.character.id, "name": draft.character.name} for draft in user.drafts.values()]}

def draft(msg, db_session):
    user_identifier = msg['user_identifier']
    character_id = msg['character_id']


    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)
    
    character = db_session.query(Character).filter(Character.id == character_id).first()
    result = "Drafting %s for %s" % (character, user_identifier)
    print(result)
    result = user.draft(character)
    print("drafted")
    print(result)
    result = db_session.commit()
    print("committed")
    print(result)
    
    result = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).values(Character.id, Character.name)
    return available_characters(None, db_session)

def release(msg, db_session):
    user_identifier = msg['user_identifier']
    character_id = msg['character_id']


    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)
    
    character = db_session.query(Character).filter(Character.id == character_id).first()
    user.release(character)
    db_session.commit()
    
    return my_drafts(msg, db_session)
