import threading

from pubnub.callbacks import SubscribeCallback
from pubnub.enums import PNStatusCategory
from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub

from threading import Lock, Thread

from mail_sender import MailSenderCls

mail_sender_cls = MailSenderCls()

class MySubscribeCallbackClass(SubscribeCallback):

    def presence(self, pubnub, presence):
        control_presence(presence.uuid, presence.event, presence.timetoken)
        print(presence.event)

    def message(self, pubnub, message):
        pass  # handle incoming messages

    def signal(self, pubnub, signal):
        pass # handle incoming signals

    def control_message(self):
        pass

class PubNubControlClass(object):  

    def __init__(self):
        self.pnconfig = PNConfiguration()

        self.pnconfig.subscribe_key = 'sub-c-3e28b73e-8348-11ea-881d-66486515f06e'
        self.pnconfig.publish_key = 'pub-c-723918b5-9e0d-4820-a277-3dda21d465cb'
        self.pnconfig.uuid = "Website-Python"

        self.pubnub = PubNub(self.pnconfig)
        self.pubnubChannel = 'web-control'

        # Initializing and starting threads
        self.subscribe_thread = Thread(target=self.subscribe_method)
        self.subscribe_thread.setDaemon(True)
        self.subscribe_thread.start()


    def subscribe_method(self):
        self.pubnub.add_listener(MySubscribeCallbackClass())        
        self.pubnub.subscribe().channels(self.pubnubChannel).with_presence().execute()

    def unsubscribe_method(self):
        self.pubnub.unsubscribe().channels(self.pubnubChannel).execute()   

def control_presence(userID, userAction, date_time):
        if(userID == 'Raspberry-pi'):
            if(userAction == "leave"):
                print('sending')
                # mail_sender_cls.send_mail('Raspberry Pi', 'Disconnected')
            elif(userAction == 'join'):
                # mail_sender_cls.send_mail('Raspberry Pi', 'Connected')
                print('sending 2')    
