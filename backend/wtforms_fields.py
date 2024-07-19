from flask_wtf import FlaskForm
from wtforms import *
from wtforms.validators import *


class RegistrationForm(FlaskForm):
    username = StringField('username_label',
                           validators=[InputRequired(message="Username Required"), 
                                        Length(min=1, max=25, message="Username must be between 1 and 25 characters")])
    password = StringField('password_label',
                           validators=[InputRequired(message="Password Required"), 
                                        Length(min=1, max=25, message="Password must be between 1 and 25 characters")])
    confirm_pswd = StringField('confirm_pswd_label',
                           validators=[InputRequired(message="Password Confirmation Required"), 
                                        EqualTo('password', message="Passwords must match")])
    submit_button = SubmitField("Sign Up")