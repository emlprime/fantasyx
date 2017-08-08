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
        "draft": draft,
        "my_drafts": my_drafts,
        "initial_info": initial_info,
        "characters": characters,
        "available_characters": available_characters,
        "draft": draft,
        "release": release,
        "scores": scores,
        "raw_scores": raw_scores,
        "user_data": user_data,
        "update_user": update_user,
        "can_draft": can_draft,
    }

    if msg_type in handlers.keys():
        response = handlers[msg_type](msg, db_session)
    else:
        response = {"error": "no handler implemented for %s" % msg_type}
    return json.dumps(response)

def initial_info(msg, db_session):
    return rubric(msg, db_session)

# The full list of characters
def rubric(msg, db_session):
    rubric = {}
    result = db_session.query(Rubric).order_by(Rubric.kind, Rubric.points).values(Rubric.description, Rubric.kind, Rubric.points, Rubric.canon)
    for row in result:
        description, kind, points, canon = row
        if not kind in rubric.keys():
            rubric[kind] = []
        rubric[kind].append({"description":description, "points":points, "kind": canon})

    return {"rubric": [{"title": title, "data": data} for title, data in rubric.items()]}

def characters(msg, db_session):
    result = db_session.query(Character).outerjoin(Draft).outerjoin(User).order_by(Character.name).values(Character.id, Character.name, Character.description, User.name)
    return {"characters": [{"id": item[0], "name": item[1], "description": item[2], "user": item[3]} for item in result if item[0]]}

# user details for the front end display
def user_data(msg, db_session):
    print "msg:"
    print msg
    user_identifier = msg['user_identifier']
    print "selecting user for user identifier: %s" % (user_identifier)
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    return {"user_data": {"email": user.email, "username": user.name, "seat_of_power": user.seat_of_power, "house_words": user.house_words}}

# characters that are unclaimed at this point in time
def available_characters(msg, db_session):
    result = db_session.query(Character).outerjoin(Draft).filter(Draft.id == None).order_by(Character.name).values(Character.id, Character.name)
    return {"available_characters": [{"id": item[0], "name": item[1]} for item in result if item[0]]}

# characters claimed by the session with this user identifier
def my_drafts(msg, db_session):
    user_identifier = msg['user_identifier']
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with name %s" % user_identifier)
    return {"my_drafts": [{"id": draft.character.id, "name": draft.character.name} for draft in user.drafts.values()]}

# scores for the game so far
def scores(msg, db_session):
    pivot = msg['options']['pivot']
    canon = msg['options']['canon']
    
    canon_filter =  "" if canon == 'altfacts' else """ WHERE r.canon='canon'"""
    index = 'user_name' if pivot == 'user' else 'character_name'
            
    query = """SELECT c.name as character_name, u.name as user_name, s.points + s.bonus as total_points, s.episode_number as episode_number FROM score s join character c on s.character_id = c.id join rubric r on r.id=s.rubric_id left outer join "user" u on u.id=s.user_id  %s""" % (canon_filter)
    print query
    df = pd.read_sql_query(query,con=db_session)
    
    pt = pd.pivot_table(df, index=index, columns='episode_number', values='total_points', aggfunc=np.sum)

    report =  json.loads(pt.to_json(orient="table"))
    report_title = "%s_%s_report" % (pivot, canon)
    return {"scores": {
        report_title: report,
    }}

def raw_scores(msg, db_session):
    canon = msg['options']['canon']
    query = db_session.query(Score).outerjoin(Character).options(lazyload('rubric'))
    if canon == 'canon':
        query = query.outerjoin(Rubric).filter(Rubric.canon == 'canon')
    raw_report = query.order_by(Score.episode_number, Character.name).all()

    data = [{
        "ep": score.episode_number,
        "notes": score.notes,
        "points": score.points,
        "bonus": score.bonus,
        "kind": score.rubric.kind,
        "canon": score.rubric.canon,
        "description": score.rubric.description,
        "character_name": score.character.name,
    } for score in raw_report]

    report = {
        "data": data,
    }
    # print report
    report_title = "raw_scores_%s_report" % (canon)
    return {"raw_scores": {
        report_title: report,
    }}
    
# action to draft character from available characters
def draft(msg, db_session):
    user_identifier = msg['user_identifier']
    character_id = msg['character_id']
    
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
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    if not user:
        raise Exception("No user found with identifier %s" % user_identifier)

    return {"can_draft": user.can_draft(db_session)}

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
    print score_config
    db_session.execute(Score.__table__.insert(), score_config)
    db_session.commit()

def update_user(msg, db_session):
    data = {
        "name": msg["data"]["username"],
        "seat_of_power": msg["data"]["seat_of_power"],
        "house_words": msg["data"]["house_words"],
    }
    
    try:
        db_session.query(User).filter(User.name == data['name']).update(data)
        db_session.commit()
        return {
            "notify": "User %s updated" % data["name"],
            "user_data": {"username": data['name'], "seat_of_power": data['seat_of_power'], "house_words": data['house_words']},
        }
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
        
