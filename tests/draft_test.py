import unittest
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
import sys
sys.path.append('../')
from fantasyx.models import *
Base = declarative_base()


        
class TestDraft(unittest.TestCase):
    def setUp(self):
        self.engine=create_engine('postgresql://admin:admin@localhost:5432/fantasyx')
        self.session = Session(bind=self.engine)
        self.user = self.session.query(User).filter(User.name=='peter').one()
        self.character1 = self.session.query(Character).filter(Character.name=='Jon Snow').one()
        self.character2 = self.session.query(Character).filter(Character.name=='Tyrion Lannister').one()
        
    def tearDown(self):
        self.session.execute("TRUNCATE TABLE draft restart identity CASCADE")
        self.session.commit()
        Base.metadata.drop_all(self.engine)
    def test_draft_list(self):
        expected = []
        result = [character.name for character in self.user.draft_list()]
        self.assertEqual(result, expected)

    def test_draft_list_one(self):
        draft = self.user.draft(self.character1)
        expected = [self.character1.name]
        result = [character.name for character in self.user.draft_list()]
        self.assertEqual(result, expected)
        
    def test_draft_list_two(self):
        self.user.draft(self.character1)
        self.user.draft(self.character2)
        expected = [self.character1.name, self.character2.name]
        result = [character.name for character in self.user.draft_list()]
        self.assertEqual(result, expected)
        
    def test_draft_list_released(self):
        self.user.draft(self.character1)
        self.user.draft(self.character2)
        
        self.user.release(self.character1)
        
        expected = [self.character2.name]
        result = [character.name for character in self.user.draft_list()]
        self.assertEqual(result, expected)

    def 
        
if __name__ == '__main__':
    unittest.main()
