import atexit

from flask import Flask
from time import sleep

from pubnub_control import PubNubControlClass

pubnub_control_class = PubNubControlClass()

app = Flask(__name__)


def flask_shutdown():
    pubnub_control_class.unsubscribe_method()


@app.route('/')
def index():
    """ Default route page  """

    return 'Hello'


try:
    if __name__ == "__main__":

        while True:
            print('Testing')
            sleep(1)

        app.run(host='0.0.0.0', threaded=True, use_reloader=False)
finally:
	atexit.register(flask_shutdown)