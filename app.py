from flask import *

from pubnub_control import PubNubControlClass

app = Flask(__name__)


@app.route('/')
def index():
    """ Default route page  """

    return 'Hello'


if __name__ == "__main__":
    pubnub_control_class = PubNubControlClass()
    
    app.run(host='0.0.0.0', threaded=True, use_reloader=False)