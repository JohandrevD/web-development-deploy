import atexit

from flask import Flask
from time import sleep

from pubnub_control import PubNubControlClass
from mail_sender import MailSenderCls

pubnub_control_class = PubNubControlClass()
mail_sender_cls = MailSenderCls()

app = Flask(__name__)


@app.route('/')
def index():
    """ Default route page  """

    return 'Hello'


if __name__ == "__main__":  

    mail_sender_cls.send_mail('Application', 'Deployed')  

    app.run(host='0.0.0.0', threaded=True, use_reloader=False)