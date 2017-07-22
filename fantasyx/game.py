import json
from models import Character, User, Draft, DraftTicket, Episode, DraftHistory, Rubric, Score
from sqlalchemy import or_
import pandas as pd
import numpy as np

def handle_event(msg_type, msg, db_session=None):
    print("handling %s" % msg_type)
    handlers = {
        "draft": draft,
        "my_drafts": my_drafts,
        "rubric": rubric,
        "characters": characters,
        "available_characters": available_characters,
        "draft": draft,
        "release": release,
        "scores": scores,
        "user_data": user_data,
        "can_draft": can_draft,
    }

    if msg_type in handlers.keys():
        response = handlers[msg_type](msg, db_session)
    else:
        response = {"error": "no handler implemented for %s" % msg_type}
    return json.dumps(response)

# The full list of characters
def rubric(msg, db_session):
    rubric = {}
    result = db_session.query(Rubric).order_by(Rubric.kind, Rubric.points).values(Rubric.description, Rubric.kind, Rubric.points)
    for row in result:
        description, kind, points = row
        if not kind in rubric.keys():
            rubric[kind] = []
        rubric[kind].append({"description":description, "points":points})
    print("writing rubric: %s" % rubric)
    return {"rubric": rubric}

def characters(msg, db_session):
    result = db_session.query(Character).outerjoin(Draft).outerjoin(User).order_by(Character.name).values(Character.id, Character.name, Character.description, User.name)
    return {"characters": [{"id": item[0], "name": item[1], "description": item[2], "user": item[3]} for item in result if item[0]]}

# user details for the front end display
def user_data(msg, db_session):
    user_identifier = msg['user_identifier']
    print "selecting user for user identifier: %s" % (user_identifier)
    user = db_session.query(User).filter(User.identifier == user_identifier).first()
    return {"user_data": {"email": user.email}}

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
    option =  "" if msg['options'] and msg['options']['include'] == 'altfacts' else """ and r.canon='canon'"""
    print "option: %s" % option
    df = pd.read_sql_query("""SELECT c.name as character_name, u.name as user_name, s.points + s.bonus as total_points, s.episode_number as episode_number FROM score s join character c on s.character_id = c.id join rubric r on r.id=s.rubric_id left outer join "user" u on u.id=s.user_id  %s""" % (option),con=db_session)
    character_pt = pd.pivot_table(df, index='character_name', columns='episode_number', values='total_points', aggfunc=np.sum)
    user_pt = pd.pivot_table(df, index='user_name', columns='episode_number', values='total_points', aggfunc=np.sum)

    character_score_report =  json.loads(character_pt.to_json(orient="table"))
    user_score_report =  json.loads(user_pt.to_json(orient="table"))
    return {"scores": {
        "character_score_report": character_score_report,
        "user_score_report": user_score_report,
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
    draft = db_session.query(DraftHistory).join(Character).filter(
        Character.id == character.id,
        DraftHistory.drafted_at < episode.aired_at,
        (or_(DraftHistory.released_at == None, DraftHistory.released_at > episode.aired_at))
    ).first()

    # If we found a draft, populate the score with the relevant user information
    if draft:
        user = draft.user
        user_id = user.id
        draft_id = draft.id
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

