import threading
import smtplib

from threading import Lock, Thread
from datetime import datetime


class MailSenderCls(object):
	def __init__(self):
		# Variables
		self.mail_interrupt = None
		self.mail_body = None
		self.mail_message = None
		self.datetime_object = None
		self.time_object = None

		# Getting e-mail settings
		self.email_address = 'jvdrasppi@gmail.com'
		self.email_password = 'wlwskycaqiiiqwsu'

		self._lock = threading.Lock()

		# Initializing and starting threads
		self.send_mail_thread = Thread(target=self.mail_flag)
		self.send_mail_thread.setDaemon(True)
		self.send_mail_thread.start()

	def mail_flag(self):
		""" Mail thread that monitors the mail interrupt thread and sends a mail when interrupted"""
		while True:
			with self._lock:
				if self.mail_interrupt:
					self.datetime_object = datetime.now()
					self.time_object = self.datetime_object.time()

					print('Sending mail...')

					with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
						smtp.ehlo()
						smtp.starttls()
						smtp.ehlo()

						smtp.login(self.email_address, self.email_password)

						subject = self.mail_body
						body = '{0} - {1}'.format(self.mail_message, self.time_object.strftime("%H:%M:%S"))

						msg = 'Subject: {0}\n\n{1}'.format(subject, body)

						smtp.sendmail(self.email_address, self.email_address, msg)
						print('Mail sent: {0}'.format(body))

				self.mail_interrupt = False
				self.mail_message = None

	def send_mail(self, rx_body, rx_message):
		""" Receiving messages to send via e-mail"""
		with self._lock:
			self.mail_interrupt = True
			self.mail_body = rx_body
			self.mail_message = rx_message

	def send_exit_mail(self, rx_message):
		""" Mail to send when server exits"""
		self.datetime_object = datetime.now()
		self.time_object = self.datetime_object.time()

		print('Sending mail...')

		with smtplib.SMTP('smtp.gmail.com', 587) as smtp:
			smtp.ehlo()
			smtp.starttls()
			smtp.ehlo()

			smtp.login(self.email_address, self.email_password)

			subject = 'Raspberry Pi Notification'
			body = '{0} - {1}'.format(rx_message, self.time_object.strftime("%H:%M:%S"))

			msg = 'Subject: {0}\n\n{1}'.format(subject, body)

			smtp.sendmail(self.email_address, self.email_address, msg)
			print('Mail sent: {0}'.format(body))
