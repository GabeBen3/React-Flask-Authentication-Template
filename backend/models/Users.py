# Users.py

import os

from dotenv import load_dotenv
from extensions import bcrypt, db
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer


class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable = False)
    password = db.Column(db.String(), unique=False, nullable = False)

    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def generate_reset_password_token(self):
        secret_key = os.getenv('SECRET_KEY')
        serializer = URLSafeTimedSerializer(secret_key)

        security_password_salt = os.getenv('SECURITY_PASSWORD_SALT')
        return serializer.dumps(self.email, salt=security_password_salt)
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def validate_reset_password_token(token: str, user_id: int):
        secret_key = os.getenv('SECRET_KEY')
        serializer = URLSafeTimedSerializer(secret_key)

        security_password_salt = os.getenv('SECURITY_PASSWORD_SALT')
        reset_pass_token_max_age = os.getenv('RESET_PASS_TOKEN_MAX_AGE')
        try:
            token_user_email = serializer.loads(
                token,
                max_age= int(reset_pass_token_max_age),
                salt=security_password_salt,
            )
        except (BadSignature, SignatureExpired):
            return None

        return Users.query.filter_by(email=token_user_email).first()