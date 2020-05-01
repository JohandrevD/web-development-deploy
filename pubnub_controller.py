from pubnub.pnconfiguration import PNConfiguration
from pubnub.pubnub import PubNub
from pubnub.callbacks import SubscribeCallback

from threading import Thread


class MySubscribeCallbackClass(SubscribeCallback):

	def __init__(self):
		print('Listener initialized')

	def presence(self, pubnub, presence):
		self.control_presence(pubnub, presence.uuid, presence.event)

	def message(self, pubnub, message):
		self.control_message(message)

	def control_presence(self, pubnub, user_id, user_action):
		print(user_id + ' - ' + user_action)
		
        if(userID == 'Raspberry_Pi'):
			if(userAction == "leave"):
				print('Raspberry Pi Disconnected')
				# mail_sender_cls.send_mail('Raspberry Pi', 'Disconnected')
			elif(userAction == 'join'):
				print('Raspberry Pi Disconnected')
				# mail_sender_cls.send_mail('Raspberry Pi', 'Connected')

	def control_message(self, msg):
		print(msg.message)


class PubNubControlClass(object):

	def __init__(self):
		self.pubnub_config = PNConfiguration()

		self.pubnub_config.subscribe_key = 'sub-c-3e28b73e-8348-11ea-881d-66486515f06e'
		self.pubnub_config.publish_key = 'pub-c-723918b5-9e0d-4820-a277-3dda21d465cb'
		self.pubnub_config.uuid = "Website_Controller"

		self.pubnub = PubNub(self.pubnub_config)
		self.pubnubChannel = 'Web_Control'

		# Initializing and starting threads
		self.subscribe_thread = Thread(target=self.subscribe_method)
		self.subscribe_thread.setDaemon(True)
		self.subscribe_thread.start()

	def subscribe_method(self):
		self.pubnub.add_listener(MySubscribeCallbackClass())
		self.pubnub.subscribe().channels(self.pubnubChannel).with_presence().execute()