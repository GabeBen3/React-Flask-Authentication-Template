

import os

from dotenv import load_dotenv
from emailTemplates.password_reset_email import \
    reset_password_email_html_content
from flask import render_template_string, url_for
from flask_mailman import EmailMessage, Mail

# Load environment variables from .env file
load_dotenv()


def password_reset_email(app, user):

    mail = Mail()

        # Mail configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False
    app.config['MAIL_USERNAME'] = '#'
    app.config['MAIL_PASSWORD'] = '#'
    app.config['MAIL_DEFAULT_SENDER'] = '#'

    mail.init_app(app)

    frontend_url = os.getenv("FRONTEND_URL")

    reset_password_url = f"{frontend_url}/reset_password/{user.generate_reset_password_token()}/{user.id}"

    email_body = render_template_string(
        reset_password_email_html_content, reset_password_url=reset_password_url
    )

    message = EmailMessage(
        "Reset your password",
        email_body,
        app.config['MAIL_USERNAME'],
        [user.email],
    )

    message.content_subtype = "html"

    message.send()


