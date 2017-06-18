from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
import sys
sys.path.append('../')
from fantasyx.models import *
Base = declarative_base()


engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
session = Session(bind=engine)

user = session.query(User).filter(User.name=='peter').one()
import pdb; pdb.set_trace()

print(user)        
