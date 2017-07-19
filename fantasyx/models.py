from sqlalchemy import Text, Column, Integer, String, ForeignKey, DateTime, func, create_engine
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session, backref
from sqlalchemy.orm.collections import attribute_mapped_collection
from datetime import datetime
Base = declarative_base()

class User(Base):
    __tablename__ = 'user'
    MAX_DRAFTS = 6
    
    id               = Column(Integer, primary_key=True)
    name             = Column(String, unique=True, nullable=False)
    seat_of_power    = Column(String, unique=True, nullable=False)
    family_words     = Column(String, unique=True, nullable=False)
    image            = Column(String, unique=True, nullable=False)
    email            = Column(String, unique=True, nullable=False)
    identifier       = Column(String, unique=True, nullable=False)
    first_name       = Column(String)
    last_name        = Column(String)
    created_at       = Column(DateTime, default=func.now())
    characters = association_proxy('drafts', 'character',
                                   creator=lambda k, v:
                                   Draft(character=v))
    drafted_characters = association_proxy('draft_histories', 'character',
                                   creator=lambda k, v:
                                   DraftHistory(character=v))
    refresh_token = Column(String)
    access_token = Column(String)
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
   
    def __repr__(self):
        return self.name

    def draft_list(self):
        return self.characters.values()
    
    def draft(self, character):
        self.characters[character.name] = character
        self.drafted_characters[character.name] = character
        return True
    
    def release(self, character):
        self.characters.pop(character.name)
        return True

    def can_draft(self, db_session):
        limit_reached = len(self.characters) >= self.MAX_DRAFTS
        if limit_reached: print "User %s has reached their draft limit" % self.name

        remaining_draft_tickets = db_session.query(DraftTicket).order_by(DraftTicket.sort)
        count_of_draft_tickets = remaining_draft_tickets.count()
        if count_of_draft_tickets:
            print "there are draft tickets remaining"
            next_draft_ticket = remaining_draft_tickets.first()
            if self.identifier == next_draft_ticket.user_identifier:
                my_turn = True
                print "It's %s's turn" % (self.name)
            else:
                user = db_session.query(User).filter(User.identifier == next_draft_ticket.user_identifier).first()
                print "It's %s's turn, not yours" % (user.name)
                my_turn = False
        else:
            my_turn = True
            print "We are finished with the drafting"

        for episode in db_session.query(Episode).all():
            is_blackout_date = episode.aired_at.date() == datetime.today().date()
            if is_blackout_date:
                print "The show is airing today. You can't draft"
            else:
                print "It's not a blackout day today"
                
        return not limit_reached and my_turn and not is_blackout_date
    
class Score(Base):
    __tablename__ = 'score'
    
    id             = Column(Integer, primary_key=True)
    character_id   = Column(Integer, ForeignKey('character.id', ondelete='CASCADE'), nullable=False, index=True)
    draft_id       = Column(Integer, ForeignKey('draft.id', ondelete='CASCADE'), nullable=True, index=True)
    user_id        = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'), nullable=True, index=True)
    rubric_id      = Column(Integer, ForeignKey('rubric.id', ondelete='CASCADE'), nullable=False, index=True)
    episode_number = Column(String)
    points         = Column(Integer)
    bonus          = Column(Integer)
    notes          = Column(String)
    
    
class Rubric(Base):
    __tablename__ = 'rubric'
    
    id           = Column(Integer, primary_key=True)
    description  = Column(String)
    kind         = Column(String)
    points       = Column(Integer)
    canon        = Column(String, nullable=False, default='canon')
    
class Episode(Base):
    __tablename__ = 'episode'
    
    id           = Column(Integer, primary_key=True)
    title        = Column(String)
    number       = Column(String, index=True)
    aired_at     = Column(DateTime, nullable=False)

    def __repr__(self):
        return "%10s %s" % (self.number, self.aired_at)
    
class DraftTicket(Base):
    __tablename__ = 'draft_ticket'

    id              = Column(Integer, primary_key=True)
    user_identifier = Column(String, nullable=False, index=True)
    sort            = Column(Integer, nullable=False, index=True)
    
    def __repr__(self):
        return self.user_identifier
    
class Draft(Base):
    __tablename__ = 'draft'

    id           = Column(Integer, primary_key=True)
    character_id = Column(Integer, ForeignKey('character.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id      = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    drafted_at   = Column(DateTime, default=func.now(), nullable=False)

    user = relationship(User, backref=backref(
                    "drafts",
                    collection_class=attribute_mapped_collection('character.name'),
                    cascade="all, delete-orphan"
                    )
                )

    character = relationship('Character', backref=backref(
                    "draftors",
                    collection_class=attribute_mapped_collection('user.name'),
                    cascade="all, delete-orphan"
                    )
                )
    
    def __repr__(self):
        return "%s drafted %s at %s" % (self.user, self.character, self.drafted_at)

class DraftHistory(Base):
    __tablename__ = 'draft_history'

    id           = Column(Integer, primary_key=True)
    character_id = Column(Integer, ForeignKey('character.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id      = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    drafted_at   = Column(DateTime, default=func.now(), nullable=False)
    released_at   = Column(DateTime)
    
    user = relationship(User, backref=backref(
                    "draft_histories",
                    collection_class=attribute_mapped_collection('character.name'),
                    cascade="all, delete-orphan"
                    )
                )
    
    character = relationship('Character', backref=backref(
                    "draft_histories",
                    collection_class=attribute_mapped_collection('user.name'),
                    cascade="all, delete-orphan"
                    )
                )
    
    def __repr__(self):
        return "%s drafted %s" % (self.user.name, self.character.name)
    
class Character(Base):
    __tablename__ = 'character'

    id               = Column(Integer, primary_key=True)
    name             = Column(String)
    description      = Column(String)
    created_at       = Column(DateTime, default=func.now())
    draftors = association_proxy('drafts', 'user',
                                   creator=lambda k, v:
                                   Draft(user=v))
    
    def __repr__(self):
        return self.name

