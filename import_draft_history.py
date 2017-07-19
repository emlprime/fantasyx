from fantasyx import db_session
from fantasyx.models import DraftHistory, Draft


db_session.execute('TRUNCATE TABLE draft_history restart identity CASCADE')
db_session.commit()
data = [
    {"character_id": 23,"user_id": 1, "drafted_at": "2017-07-15 04:20:26.268810"},
    {"character_id": 10,"user_id": 2, "drafted_at": "2017-07-15 04:16:32.818955"},
    {"character_id": 2,"user_id": 3, "drafted_at": "2017-07-15 04:16:20.073565"},
    {"character_id": 45,"user_id": 4, "drafted_at": "2017-07-15 04:16:30.200228"},
    {"character_id": 8,"user_id": 5, "drafted_at": "2017-07-15 04:16:25.861512"},
    {"character_id": 5,"user_id": 6, "drafted_at": "2017-07-15 04:20:35.351687"},
    {"character_id": 53,"user_id": 7, "drafted_at": "2017-07-15 04:25:17.090001"},
    {"character_id": 21,"user_id": 8, "drafted_at": "2017-07-15 04:25:21.221221"},
    {"character_id": 44,"user_id": 8, "drafted_at": "2017-07-15 04:26:06.849660"},
    {"character_id": 46,"user_id": 7, "drafted_at": "2017-07-15 04:25:50.780972"},
    {"character_id": 54,"user_id": 6, "drafted_at": "2017-07-15 04:24:58.457519"},
    {"character_id": 47,"user_id": 5, "drafted_at": "2017-07-15 04:26:37.558903"},
    {"character_id": 36,"user_id": 4, "drafted_at": "2017-07-15 04:24:53.168120"},
    {"character_id": 15,"user_id": 3, "drafted_at": "2017-07-15 04:25:02.709974"},
    {"character_id": 11,"user_id": 2, "drafted_at": "2017-07-15 04:25:15.019190"},
    {"character_id": 24,"user_id": 1, "drafted_at": "2017-07-15 04:32:00.299434"},
    {"character_id": 19,"user_id": 1, "drafted_at": "2017-07-15 04:37:41.319260"},
    {"character_id": 43,"user_id": 2, "drafted_at": "2017-07-15 04:24:52.204211"},
    {"character_id": 35,"user_id": 3, "drafted_at": "2017-07-15 04:31:37.340239"},
    {"character_id": 6,"user_id": 4, "drafted_at": "2017-07-15 04:31:11.526548"},
    {"character_id": 4,"user_id": 5, "drafted_at": "2017-07-15 04:25:16.659612"},
    {"character_id": 56,"user_id": 6, "drafted_at": "2017-07-15 04:30:32.264382"},
    {"character_id": 3,"user_id": 7, "drafted_at": "2017-07-15 04:29:03.383688"},
    {"character_id": 16,"user_id": 8, "drafted_at": "2017-07-15 04:30:57.814690"},
    {"character_id": 7,"user_id": 8, "drafted_at": "2017-07-15 04:44:50.772942"},
    {"character_id": 39,"user_id": 7, "drafted_at": "2017-07-15 04:43:41.677035"},
    {"character_id": 50,"user_id": 6, "drafted_at": "2017-07-15 04:42:50.333503"},
    {"character_id": 49,"user_id": 5, "drafted_at": "2017-07-15 04:42:11.686078"},
    {"character_id": 14,"user_id": 4, "drafted_at": "2017-07-15 04:41:15.364498"},
    {"character_id": 17,"user_id": 3, "drafted_at": "2017-07-15 04:40:51.551527"},
    {"character_id": 27,"user_id": 2, "drafted_at": "2017-07-15 04:40:09.034617"},
    {"character_id": 48,"user_id": 1, "drafted_at": "2017-07-15 04:39:03.117292"},
    {"character_id": 30,"user_id": 1, "drafted_at": "2017-07-15 04:51:03.460021"},
    {"character_id": 37,"user_id": 2, "drafted_at": "2017-07-15 04:47:32.431639"},
    {"character_id": 31,"user_id": 3, "drafted_at": "2017-07-15 04:47:24.051996"},
    {"character_id": 29,"user_id": 4, "drafted_at": "2017-07-15 04:46:50.696532"},
    {"character_id": 12,"user_id": 5, "drafted_at": "2017-07-15 04:54:15.588253"},
    {"character_id": 9,"user_id": 6, "drafted_at": "2017-07-15 04:46:08.293758"},
    {"character_id": 32,"user_id": 7, "drafted_at": "2017-07-15 04:46:34.181198"},
    {"character_id": 22,"user_id": 8, "drafted_at": "2017-07-15 04:45:13.764614"},
    {"character_id": 18,"user_id": 8, "drafted_at": "2017-07-15 05:01:40.193538"},
    {"character_id": 42,"user_id": 7, "drafted_at": "2017-07-15 05:01:07.593496"},
    {"character_id": 38,"user_id": 6, "drafted_at": "2017-07-15 04:59:47.663389"},
    {"character_id": 52,"user_id": 5, "drafted_at": "2017-07-15 05:03:06.970645"},
    {"character_id": 40,"user_id": 4, "drafted_at": "2017-07-15 04:56:08.375213"},
    {"character_id": 51,"user_id": 3, "drafted_at": "2017-07-15 04:55:13.218849"},
    {"character_id": 25,"user_id": 2, "drafted_at": "2017-07-15 04:57:00.676393"},
    {"character_id": 13,"user_id": 1, "drafted_at": "2017-07-15 04:45:38.082674"},
]

db_session.execute(DraftHistory.__table__.insert(), data)
db_session.execute(Draft.__table__.insert(), data)
db_session.commit()
