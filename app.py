import atexit

from flask import Flask
from time import sleep

from pubnub_control import PubNubControlClass

pubnub_control_class = PubNubControlClass()

app = Flask(__name__)


@app.route('/')
def index():
    """ Default route page  """

    return 'Hello'


if __name__ == "__main__":    

    app.run(host='0.0.0.0', threaded=True, use_reloader=False)