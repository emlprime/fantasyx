from sqlalchemy import Text, Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Character(Base):
    __tablename__ = 'character'

    id               = Column(Integer, primary_key=True)
    name             = Column(String)
    created_at       = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return 'i_id: {}, ({})'.format(self.id, self.name)

    
