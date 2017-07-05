from sqlalchemy import Text, Column, Integer, String, ForeignKey, DateTime, func, create_engine
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session, backref
from sqlalchemy.orm.collections import attribute_mapped_collection

Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    id               = Column(Integer, primary_key=True)
    name             = Column(String, unique=True, nullable=False)
    email            = Column(String, unique=True, nullable=False)
    identifier       = Column(String, unique=True, nullable=False)
    first_name       = Column(String)
    last_name        = Column(String)
    icon             = Column(String)
    created_at       = Column(DateTime, default=func.now())
    characters = association_proxy('drafts', 'character',
                                   creator=lambda k, v:
                                   Draft(character=v))
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
        return True
    
    def release(self, character):
        self.characters.pop(character.name)
        return True
    
class DraftTicket(Base):
    __tablename__ = 'draft_ticket'

    id              = Column(Integer, primary_key=True)
    user_identifier = Column(String, nullable=False, index=True)
    sort            = Column(Integer, nullable=False, index=True)
    
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

class Character(Base):
    __tablename__ = 'character'

    id               = Column(Integer, primary_key=True)
    name             = Column(String)
    created_at       = Column(DateTime, default=func.now())
    draftors = association_proxy('drafts', 'user',
                                   creator=lambda k, v:
                                   Draft(user=v))
    
    def __repr__(self):
        return self.name

