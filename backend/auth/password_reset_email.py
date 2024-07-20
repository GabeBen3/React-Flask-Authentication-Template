

import os
from mailbox import Message

from dotenv import load_dotenv
from emailTemplates.password_reset_email import \
    reset_password_email_html_content
from extensions import mail
from flask import render_template_string, url_for
from flask_mailman import EmailMessage, Mail

# Load environment variables from .env file
load_dotenv()

def initialize_mailing_info(app):
    
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
    app.config['MAIL_USE_TLS'] = bool(os.getenv('MAIL_USE_TLS'))
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')    


def password_reset_email(user):
    
    frontend_url = os.getenv("FRONTEND_URL")

    reset_password_url = f"{frontend_url}/reset_password/{user.generate_reset_password_token()}/{user.id}"

    email_body = render_template_string(
        reset_password_email_html_content, reset_password_url=reset_password_url
    )

    message = EmailMessage(
        "Reset your password",
        email_body,
        os.getenv("MAIL_USERNAME"),
        [user.email],
    )

    message.content_subtype = "html"

    message.send()

