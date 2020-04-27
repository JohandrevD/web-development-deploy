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
        self.control_presence(presence.uuid, presence.event, presence.timetoken)

    def message(self, pubnub, message):
        self.control_message(message)

    def signal(self, pubnub, signal):
        pass # handle incoming signals

    def control_message(self, msg):
        print(msg)
        if msg.publisher == 'Website_IoT_HTML':
			if msg.message == 'Jvd77655':
				pubnub.publish().channel("Web_Control").message('Access').sync()
                mail_sender_cls.send_mail('IoT', 'Access Granted')
			else:
				pubnub.publish().channel("Web_Control").message('No Access').sync()
                mail_sender_cls.send_mail('IoT', 'Someone tried to access the page')

    def control_presence(self, userID, userAction, date_time):
        if(userID == 'Raspberry_Pi'):
            if(userAction == "leave"):
                mail_sender_cls.send_mail('Raspberry Pi', 'Disconnected')
            elif(userAction == 'join'):
                mail_sender_cls.send_mail('Raspberry Pi', 'Connected')  

class PubNubControlClass(object): 

    def __init__(self):
        self.pnconfig = PNConfiguration()

        self.pnconfig.subscribe_key = 'sub-c-3e28b73e-8348-11ea-881d-66486515f06e'
        self.pnconfig.publish_key = 'pub-c-723918b5-9e0d-4820-a277-3dda21d465cb'
        self.pnconfig.uuid = "Website_Main_Python"

        self.pubnub = PubNub(self.pnconfig)
        self.pubnubChannel = 'Web_Control'

        # Initializing and starting threads
        self.subscribe_thread = Thread(target=self.subscribe_method)
        self.subscribe_thread.setDaemon(True)
        self.subscribe_thread.start()


    def subscribe_method(self):
        self.pubnub.add_listener(MySubscribeCallbackClass())        
        self.pubnub.subscribe().channels(self.pubnubChannel).with_presence().execute()

    def unsubscribe_method(self):
        self.pubnub.unsubscribe().channels(self.pubnubChannel).execute()   
