from flask import Flask
from flask_uwsgi_websocket import GeventWebSocket

app = Flask(__name__)
websocket = GeventWebSocket(app)

@websocket.route('/test')
def test(ws):
    while True:
        msg = ws.receive()
        print("message: %s" % msg)
        ws.send(msg)

if __name__ == '__main__':
    app.run(gevent=100, debug=True)
