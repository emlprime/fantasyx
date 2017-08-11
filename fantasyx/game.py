import json
from models import Character, User, Draft, DraftTicket, Episode, DraftHistory, Rubric, Score
from sqlalchemy import or_, exc
from sqlalchemy.orm import lazyload
from datetime import timedelta
import pandas as pd
import numpy as np


def handle_event(msg_type, msg, db_session=None):
    print("handling %s" % msg_type)
    handlers = {
        "DRAFT": draft,
        "RELEASE": release,
        "UPDATE_USER": update_user,
    }
    print "msg_type: %s" % msg
    if msg_type in handlers.keys():
        response = handlers[msg_type](msg, db_session)
    else:
        response = {"error": "no handler implemented for %s" % msg_type}
    return response

def initial_data(user_identifier, db_session):
    rubric = format_rubric(db_session)
    characters = format_characters(db_session)
    scores = format_scores(db_session)
    owners = format_owners(db_session)
    
    user_data = format_user_data(user_identifier, db_session)
    can_draft = format_can_draft(user_identifier,db_session)
    can_release = format_can_release(user_identifier,db_session)
    
    return [rubric, characters, scores, owners, can_draft, user_data]

def format_owners(db_session):
    result = db_session.query(User).order_by(User.name).values(User.name)
    owners = [{"username": user[0]} for user in result]
    return {"type": "OWNERS", "owners": owners}

# The full list of characters
def format_rubric(db_session):
    rubric = {}
    result = db_session.query(Rubric).order_by(Rubric.kind, Rubric.points).values(Rubric.description, Rubric.kind, Rubric.points, Rubric.canon)
    for row in result:
        description, kind, points, canon = row
        if not kind in rubric.keys():
            rubric[kind] = []
        rubric[kind].append({"description":description, "points":points, "kind": canon})

    return {"type": "RUBRIC", "rubric": [{"title": title, "data": data} for title, data in rubric.items()]}

def format_characters(db_session):
    result = db_session.query(Character).outerjoin(Draft).outerjoin(User).order_by(Character.name).values(Character.id, Character.name, Character.description, User.name)
    return {"type": "CHARACTERS", "characters": [{"id": item[0], "name": item[1], "description": item[2], "user": item[3]} for item in result if item[0]]}

# user details for the front end display
def format_user_data(user_identifier, db_session):
    print "selecting user for user identifier: %s" % (user_identifier)
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    return {"type": "USER_DATA", "user_data": {"email": user.email, "username": user.name, "seat_of_power": user.seat_of_power, "house_words": user.house_words}}

def format_scores(db_session):
    query = db_session.query(Score).outerjoin(Character).options(lazyload('rubric'))
    raw_report = query.order_by(Score.episode_number, Character.name).all()

    scores = [{
        "id": score.id,
        "episode_number": score.episode_number,
        "owner": score.user.name if score.user else "",
        "notes": score.notes,
        "points": score.points,
        "bonus": score.bonus,
        "score": score.points + (score.bonus or 0),
        "kind": score.rubric.kind,
        "canon": score.rubric.canon,
        "description": score.rubric.description,
        "character_name": score.character.name,
    } for score in raw_report]

    return {"type":"SCORES", "scores": scores}
    
# action to draft character from available characters
def draft(data, db_session):
    user_identifier = data["data"]["user_identifier"]
    character_id = data["data"]["character_id"]
    
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)
    
    if not user.can_draft(db_session):
        return {"can_draft": False}
    
    draft_ticket = user.next_draft_ticket(db_session)

    if draft_ticket:
        if not draft_ticket.user_identifier == user_identifier:
            raise Exception("It is not %s's turn to draft" % user_identifier)
    
    character = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).filter(Character.id == character_id).first()
    
    result = "Drafting %s for %s" % (character, user_identifier)

    user.draft(character)
    if draft_ticket:
        db_session.delete(draft_ticket)
        
    db_session.commit()
    db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).values(Character.id, Character.name)
    return "%s drafted %s" % (user.name, character.name)

# action to release a character from the draft for this user_identifier
def release(data, db_session):
    user_identifier = data["data"]["user_identifier"]
    character_id = data["data"]["character_id"]
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)
    
    character = db_session.query(Character).filter(Character.id == character_id).first()
    user.release(character)
    db_session.commit()
    
    return "%s released %s" % (user.name, character.name)

def format_can_draft(user_identifier, db_session):
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)

    return {"type": "CAN_DRAFT", "can_draft": user.can_draft(db_session)}

def format_can_release(user_identifier, db_session):
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)

    return {"type": "CAN_RELEASE", "can_release": user.can_release(db_session)}

def generate_score(msg, db_session):
    # Get the character from the unique character name
    character_name = msg['character_name']
    character = db_session.query(Character).filter(Character.name == character_name).first()
    if not character:
        db_session.execute(Character.__table__.insert(), [{"name": character_name}])
        character = db_session.query(Character).filter(Character.name == character_name).first()
    # get the episode from the unique episode number
    episode_number = msg['episode_number']
    episode = db_session.query(Episode).filter(Episode.number == episode_number).first()
    
    # get a draft from the draft history. This is a historically idempotend approach
    # ideally we should be able to clear and regenerate the scores at any time based on the draft history data. This depends upon the assumption that no drafts can be overlapping
    draft_history = db_session.query(DraftHistory).join(Character).filter(
        Character.id == character.id,
        DraftHistory.drafted_at < (episode.aired_at - timedelta(hours=4)),
        (or_(DraftHistory.released_at == None, DraftHistory.released_at > episode.aired_at))
    ).first()

    # If we found a draft, populate the score with the relevant user information
    if draft_history:
        user = draft_history.user
        user_id = user.id
        draft_id = draft_history.id
        # if we don't find a draft, still create the score, but don't associate it with a 
        # user this gives us a sense of the "points on the table" that were left because 
        # nobody had that character drafted at the time.
    else:
        user_id = None
        draft_id = None

    # specify the description, but apply points from the rubric
    # this depends on the assumption that the rubric doesn't change once the
    # game is in motion. If the rubric changes
    rubric_description = msg['rubric_description']
    rubric = db_session.query(Rubric).filter(Rubric.description == rubric_description).first()
    if not rubric:
        db_session.execute(Rubric.__table__.insert(), [{"description": rubric_description, "points": msg['points'] or 0, "canon": "altfacts"}])
        rubric = db_session.query(Rubric).filter(Rubric.description == rubric_description).first()
    # bonus can be applied if specified. If there is no bonus, make it 0 for easier summing
    bonus = int(msg['bonus'] or 0)

    # notes are to explain why specifically they got this.
    notes = msg['notes']
    
    score_config = {
        "character_id": character.id,
        "draft_id": draft_id,
        "user_id": user_id,
        "episode_number": episode.number,
        "rubric_id": rubric.id,
        "points": rubric.points,
        "bonus": bonus,
        "notes": notes,
    }
    db_session.execute(Score.__table__.insert(), score_config)
    db_session.commit()

def update_user(msg, db_session):
    data = {
        "name": msg["data"]["username"],
        "seat_of_power": msg["data"]["seat_of_power"],
        "house_words": msg["data"]["house_words"],
    }
    print data
    try:
        db_session.query(User).filter(User.name == data['name']).update(data)
        db_session.commit()
    #     return {
    #         "notify": "User %s updated" % data["name"],
    #         "user_data": {"username": data['name'], "seat_of_power": data['seat_of_power'], "house_words": data['house_words']},
    #     }
    except exc.InternalError, exception:
        reason = exception.message
        print "Failed because: %s" % reason
        db_session.rollback()
        return {"notify": "User %s failed to update because %s" % (data["name"], reason)}
    except exc.IntegrityError, exception:
        reason = exception.message
        print "Failed because: %s" % reason
        db_session.rollback()
        return {"notify": "User %s failed to update because %s" % (data["name"], reason)}
        
