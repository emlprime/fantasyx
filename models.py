from sqlalchemy import Text, Column, Integer, String, ForeignKey, DateTime, func, create_engine
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session, backref
from sqlalchemy.orm.collections import attribute_mapped_collection

Base = declarative_base()

# engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
# session = Session(bind=engine)


class User(Base):
    __tablename__ = 'user'

    id               = Column(Integer, primary_key=True)
    name             = Column(String)
    created_at       = Column(DateTime, default=func.now())
    characters = association_proxy('drafts', 'character',
                                   creator=lambda k, v:
                                   Draft(character=v))
    
    def __repr__(self):
        return self.name

    def draft_list(self):
        return self.characters.values()
    
    def draft(self, character):
        self.characters[character.name] = character
        return self.characters[character.name]
    
    def remove(self, character):
        draft = self.drafts[character.name]
        draft.returned_at = func.now()
        rem_character = self.characters.pop(character.name)
        return rem_character
    
class Draft(Base):
    __tablename__ = 'draft'

    id           = Column(Integer, primary_key=True)
    character_id = Column(Integer, ForeignKey('character.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id      = Column(Integer, ForeignKey('user.id', ondelete='CASCADE'), nullable=False, index=True)
    drafted_at   = Column(DateTime, default=func.now(), nullable=False)
    returned_at  = Column(DateTime, nullable=True)

    user = relationship(User, backref=backref(
                    "drafts",
                    collection_class=attribute_mapped_collection('character.name'),
                    cascade="all, delete-orphan"
                    )
                )
    character = relationship("Character")
    
    def __repr__(self):
        return "%s drafted %s at %s" % (self.user, self.character, self.drafted_at)

class Character(Base):
    __tablename__ = 'character'

    id               = Column(Integer, primary_key=True)
    name             = Column(String)
    created_at       = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return self.name

