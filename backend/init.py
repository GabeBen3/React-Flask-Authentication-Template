from flask import Flask

from .extensions import db


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://postgres:password@localhost:5432/poke_db"

    db.init_app(app)