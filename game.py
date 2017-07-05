import json
from models import Character, User, Draft, DraftTicket

def handle_event(msg_type, msg, db_session=None):
    print("handling %s" % msg_type)
    handlers = {
        "draft": draft,
        "my_drafts": my_drafts,
        "characters": characters,
        "available_characters": available_characters,
        "draft": draft,
        "release": release,
        "user_data": user_data,
        "can_draft": can_draft,
    }
    if msg_type in handlers.keys():
        
        response = handlers[msg_type](msg, db_session)
    else:
        response = {"error": "no handler implemented for %s" % msg_type}
    return json.dumps(response)

# The full list of characters
def characters(msg, db_session):
    result = db_session.query(Character).outerjoin(Draft).outerjoin(User).values(Character.id, Character.name, User.name)
    return {"characters": [{"id": item[0], "name": item[1], "user": item[2]} for item in result if item[0]]}

# user details for the front end display
def user_data(msg, db_session):
    user_identifier = msg['user_identifier']
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    return {"user_data": {"email": user.email}}

# characters that are unclaimed at this point in time
def available_characters(msg, db_session):
    result = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).values(Character.id, Character.name)
    return {"available_characters": [{"id": item[0], "name": item[1]} for item in result if item[0]]}

# characters claimed by the session with this user identifier
def my_drafts(msg, db_session):
    user_identifier = msg['user_identifier']
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with name %s" % user_identifier)
    return {"my_drafts": [{"id": draft.character.id, "name": draft.character.name} for draft in user.drafts.values()]}

# action to draft character from available characters
def draft(msg, db_session):
    user_identifier = msg['user_identifier']
    character_id = msg['character_id']

    draft_ticket = db_session.query(DraftTicket).order_by(DraftTicket.sort).first()
    if not draft_ticket.user_identifier == user_identifier:
        raise Exception("It is not %s's turn to draft" % user_identifier)
    
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)
    
    character = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).filter(Character.id == character_id).first()
    result = "Drafting %s for %s" % (character, user_identifier)
    user.draft(character)
    db_session.delete(draft_ticket)
    db_session.commit()
    db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).values(Character.id, Character.name)
    return available_characters(msg, db_session)

# action to release a character from the draft for this user_identifier
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

def can_draft(msg, db_session):
    user_identifier = msg['user_identifier']
    draft_ticket = db_session.query(DraftTicket).order_by(DraftTicket.sort).first()
    can_draft = draft_ticket.user_identifier == user_identifier
    return {"can_draft": can_draft}
