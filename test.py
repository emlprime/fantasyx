from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from fantasyx.models import Character
from flask import Flask
from flask_dotenv import DotEnv

Base = declarative_base()
app = Flask(__name__)
env = DotEnv()
env.init_app(app, env_file='.env', verbose_mode=True)

engine=create_engine('postgresql://%(DB_USERNAME)s:%(DB_PASSWORD)s@%(DB_ENDPOINT)s:5432/fantasyx' % app.config)
db_session = Session(bind=engine)

result = db_session.query(Character).count()
print result
