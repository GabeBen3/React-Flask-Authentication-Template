# __init__.py

import os
from datetime import *

from auth.password_reset_email import initialize_mailing_info
from auth.registration import registration_bp
from extensions import bcrypt, db, mail
from flask import Flask, json
from flask_jwt_extended import (JWTManager, create_access_token, get_jwt,
                                get_jwt_identity)


def create_app():
    app = Flask(__name__)
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY')

    db.init_app(app)
    bcrypt.init_app(app)

    initialize_mailing_info(app)

    mail.init_app(app)

    JWTManager(app)
    

    # Register All Registration Routes
    app.register_blueprint(registration_bp)

    return app