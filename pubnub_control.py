import threading

from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

from threading import Lock, Thread


class PubNubControlClass(object):

    pnconfig = PNConfiguration()

    pnconfig.subscribe_key = 'sub-c-3e28b73e-8348-11ea-881d-66486515f06e'
    pnconfig.publish_key = 'pub-c-723918b5-9e0d-4820-a277-3dda21d465cb'
    pnconfig.uuid = "Website-python"

    pubnub = PubNub(pnconfig)

    def __init__(self):
        self._lock = threading.Lock()

        # Initializing and starting threads
        self.subscribe_thread = Thread(target=self.mail_flag)
        self.subscribe_thread.setDaemon(True)
        self.subscribe_thread.start()

    def mail_flag(self):
        pass
