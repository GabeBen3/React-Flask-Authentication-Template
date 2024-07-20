from flask_bcrypt import Bcrypt
from flask_mailman import Mail
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
bcrypt = Bcrypt()
mail = Mail()
