import os
from datetime import *

import flask_login
import psycopg2
from auth.password_reset_email import password_reset_email
from auth.registration import registration_bp
from emailTemplates.password_reset_email import \
    reset_password_email_html_content
from flask import (Flask, json, jsonify, make_response, redirect,
                   render_template, render_template_string, request,
                   send_from_directory, url_for)
from flask_bcrypt import Bcrypt
from flask_jwt_extended import *
from flask_mailman import EmailMessage, Mail
from flask_sqlalchemy import SQLAlchemy
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from wtforms_fields import RegistrationForm

x = datetime.now()
 
# Initializing flask app
app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

# Encryption initialization
bcrypt = Bcrypt(app) 

app.secret_key = 'keep it secret, keep it safe' 

# Authentification init. 
JWTManager(app)

login_manager = flask_login.LoginManager()

login_manager.init_app(app)

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

app.config["JWT_SECRET_KEY"] = "efas ti peek ,terces ti peek"


# Database Management Initilization
# # SECURITY RISK  -  Encryption to be added later 
app.config["SQLALCHEMY_DATABASE_URI"] = "#"

app.config["JWT_SECRET_KEY"] = "efas ti peek ,terces ti peek"

app.config['SECURITY_PASSWORD_SALT'] = 'your_password_salt_here'

db = SQLAlchemy(app)

app.config["RESET_PASS_TOKEN_MAX_AGE"] = 600 # 15 mins in seconds


# SQLAlchemy class initialization
class Users(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable = False)
    password = db.Column(db.String(), unique=False, nullable = False)

    def __init__(self, id, email, password):
        self.id = id
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def generate_reset_password_token(self):
        serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])

        return serializer.dumps(self.email, salt=app.config['SECURITY_PASSWORD_SALT'])
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def validate_reset_password_token(token: str, user_id: int):

        serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
        try:
            token_user_email = serializer.loads(
                token,
                max_age=app.config["RESET_PASS_TOKEN_MAX_AGE"],
                salt=app.config['SECURITY_PASSWORD_SALT'],
            )
        except (BadSignature, SignatureExpired):
            return None

        return Users.query.filter_by(email=token_user_email).first()
    
    



# @login_manager.user_loader
# def load_user(user_id):
#     return User.get(user_id)

# Refresh JWT after access toekn expires
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


# /signup_user
# # Adds new login credentials to database
@app.route("/signup_user", methods=["POST"])
def signup_user():

    #Pull JSON data from request
    data = request.get_json()
  
    if data:
        # Get the data from the form 
        email_ = data.get('email')
        password_ = data.get('password')

        #print(f"{email_} : {password_}")

        user_object = Users.query.filter_by(email=email_).all()

        #print(user_object)

        if user_object:
            return jsonify({"message": "email taken!"})
        else:

            new_user = Users(email = email_, password = password_)

            db.session.add(new_user)
            db.session.commit()

            # Return a JSON response
            return jsonify({"message": "Data received", "email": email_, "password": password_})
    else:
        return jsonify({"message": "No data received!"}), 400
    
# /login_user
# # Attempt login with given credentials 
# # Generate access token to give user access to session 

#@app.register_blueprint(registration_bp)

@app.route("/login_user", methods=["POST"])
def login_user():

     #Pull JSON data from request
    data = request.get_json()

    #login validation 
    if data:
        email_ = data.get('email')
        password_ = data.get('password')

        user_object = Users.query.filter_by(email = email_).first()

        if user_object:
            if bcrypt.check_password_hash(user_object.password, password_):

                access_token = create_access_token(identity=user_object.email)
                refresh_token = create_refresh_token(identity=user_object.email)

                response = make_response(jsonify({"message": "Login Successful", "access_token": access_token}), 200)

                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)

                return response, 200
            else:
                return jsonify({"message": "email or password incorrect"}), 200

        else:
            return jsonify({"message": "email or password incorrect"}), 200

    else: 
        return jsonify({"message": "No data received!"}), 400 
    
# /logout_user 
# # Logs the user out and unsets JWT cookies   
@app.route("/logout_user", methods=["GET"])
# @jwt_required()
def logout_user():

    response = jsonify({"message": "Logout Successful"})
    unset_jwt_cookies(response)

    return response


@app.route("/fetch_credentials")
@jwt_required()
def fetch_credentials():
    current_user_identity = get_jwt_identity()

    user_object = Users.query.filter_by(email= current_user_identity).first()

    response = {
        "email": user_object.email,
    }

    return jsonify(response)

@app.route("/verify_email", methods=["POST"])
def verify_email():

    data = request.get_json()

    if data: 
        email_ = data.get("email")

        user_object = Users.query.filter_by(email = email_).first()

        if user_object:
            return jsonify({"message":"Email Verified"}), 200
        else:
            return jsonify({"message":"Email not found in database"}), 200

    else:
        return jsonify({"message":"No data received!"}), 400
        

@app.route("/confirm_password", methods=["POST"])
@jwt_required()
def confirm_password():
    data = request.get_json()

    #login validation 
    if data:
        password_ = data.get('formPassword')

        current_user_identity = get_jwt_identity()

        user_object = Users.query.filter_by(email= current_user_identity).first()

        if user_object:
            if bcrypt.check_password_hash(user_object.password, password_):
                

                response = make_response(jsonify({"message": "Confirm Password Successful", "email": user_object.email}), 200)

                return response, 200
            else:
                return jsonify({"message": "Password incorrect"}), 200

        else:
            return jsonify({"message": "Password incorrect"}), 200

    else: 
        return jsonify({"message": "No data received!"}), 400 


@app.route("/change_email", methods=["POST"])
@jwt_required()
def change_email():
    data = request.get_json()

    if data:

        newemail = data.get("newemail")

        email_already_exists = Users.query.filter_by(email= newemail).first()

        if (email_already_exists):
            return jsonify({"message": "email already taken"}), 200
        else:
            current_user_identity = get_jwt_identity()

            user_object = Users.query.filter_by(email= current_user_identity).first()

            if user_object:
                user_object.email = newemail
                db.session.commit()
                
                access_token = create_access_token(identity=user_object.email)
                refresh_token = create_refresh_token(identity=user_object.email)

                response = make_response(jsonify({"message": "email updated", "access_token": access_token}), 200)

                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)
                return response, 200

            else:
                return jsonify({"message": "User not found"}), 200

    else: 
        return jsonify({"message": "No data received!"}), 400 

@app.route("/generate_recovery_url", methods=["POST"])
def generate_recovery_url():
    data = request.get_json()

    if data:

        email_ = data.get("email")

        user_object = Users.query.filter_by(email= email_).first()

        password_reset_email(app, user_object)
        
        return jsonify({"message": "URL_generated"}), 200

    else: 
        return jsonify({"message": "No data received!"}), 400

@app.route("/reset_password/<token>/<int:user_id>", methods=["POST"])
def reset_password(token, user_id):
    data = request.get_json()
    
    if data:

        user_object = Users.validate_reset_password_token(token, user_id)
        
        if user_object:
            # print("Token valid")
            new_pswd_ = data.get("new_pswd")

            if bcrypt.check_password_hash(user_object.password, new_pswd_):
                return jsonify({"message": "New password cannot match old password"}), 200   
            else:
                user_object.set_password(new_pswd_)
                print(user_object.password)
                db.session.commit()
                return jsonify({"message": "Token valid - Password has been changed"}), 200   
    
        else:
            # print("Invalid or Expired Token")
            return jsonify({"message": "Invalid or Expired Token"}), 200 
    else: 
        return jsonify({"message": "No data received"}), 200 
    
@app.route("/change_password", methods=["POST"])
@jwt_required()
def change_password():
    print("Entered")
    data = request.get_json()
    
    if data:

        current_user_identity = get_jwt_identity()
        
        user_object = Users.query.filter_by(email= current_user_identity).first()
        
        if user_object:

            old_pswd_ = data.get("old_pswd")

            new_pswd_ = data.get("new_pswd")

            print(old_pswd_ + ":" + new_pswd_)

            if not bcrypt.check_password_hash(user_object.password, old_pswd_):
                return jsonify({"message": "Old Password is Incorrect"}), 200   
            

            if bcrypt.check_password_hash(user_object.password, new_pswd_):
                return jsonify({"message": "New password cannot match old password"}), 200   
            
            user_object.set_password(new_pswd_)
            print(user_object.password)
            db.session.commit()
            return jsonify({"message": "Password has been changed"}), 200   
    
        else:
            # print("Invalid or Expired Token")
            return jsonify({"message": "No user found"}), 200 
    else: 
        return jsonify({"message": "No data received"}), 200    







# @app.route('/crud') 
# def index(): 
#     # Connect to the database 
#     conn = psycopg2.connect(database="poke_db",  
#                         user="postgres", 
#                         password="password",  
#                         host="localhost", port="5432") 
  
#     # create a cursor 
#     cur = conn.cursor() 
  
#     # Select all products from the table 
#     cur.execute('''SELECT * FROM products''') 
  
#     # Fetch the data 
#     data = cur.fetchall() 
  
#     # close the cursor and connection 
#     cur.close() 
#     conn.close() 
  
#     return render_template('index.html', data=data) 



# @app.route('/create', methods=['POST']) 
# def create(): 
#     conn = psycopg2.connect(database="poke_db",  
#                         user="postgres", 
#                         password="password",  
#                         host="localhost", port="5432") 
  
#     cur = conn.cursor() 
  
#     # Get the data from the form 
#     name = request.form['name'] 
#     price = request.form['price'] 
  
#     # Insert the data into the table 
#     cur.execute( 
#         '''INSERT INTO products (name, price) VALUES (%s, %s)''', 
#         (name, price)) 
  
#     # commit the changes 
#     conn.commit() 
  
#     # close the cursor and connection 
#     cur.close() 
#     conn.close() 
  
#     return redirect(url_for('index')) 
  
  
# @app.route('/update', methods=['POST']) 
# def update(): 
#     conn = psycopg2.connect(database="poke_db",  
#                         user="postgres", 
#                         password="password",  
#                         host="localhost", port="5432") 
  
#     cur = conn.cursor() 
  
#     # Get the data from the form 
#     name = request.form['name'] 
#     price = request.form['price'] 
#     id = request.form['id'] 
  
#     # Update the data in the table 
#     cur.execute( 
#         '''UPDATE products SET name=%s, price=%s WHERE id=%s''', (name, price, id)) 
  
#     # commit the changes 
#     conn.commit() 
#     return redirect(url_for('index')) 
  
  
# @app.route('/delete', methods=['POST']) 
# def delete(): 
#     conn = psycopg2.connect (database="poke_db",  
#                         user="postgres", 
#                         password="password",  
#                         host="localhost", port="5432") 
#     cur = conn.cursor() 
  
#     # Get the data from the form 
#     id = request.form['id'] 
  
#     # Delete the data from the table 
#     cur.execute('''DELETE FROM products WHERE id=%s''', (id,)) 
  
#     # commit the changes 
#     conn.commit() 
  
#     # close the cursor and connection 
#     cur.close() 
#     conn.close() 
  
#     return redirect(url_for('index')) 



# conn = psycopg2.connect(database="poke_db",  
#                         user="postgres", 
#                         password="password",  
#                         host="localhost", port="5432") 


# # create a cursor 
# cur = conn.cursor() 
  
# # if you already have any table or not id doesnt matter this  
# # will create a products table for you. 
# cur.execute( 
#     '''CREATE TABLE IF NOT EXISTS products (id serial PRIMARY KEY, name varchar(100), price float);''') 
  
# # Insert some data into the table 
# cur.execute( 
#     '''INSERT INTO products (name, price) VALUES ('Apple', 1.99), ('Orange', 0.99), ('Banana', 0.59);''') 

# # commit the changes 
# conn.commit() 
  
# # close the cursor and connection 
# cur.close() 
# conn.close() 
     
# Running app
if __name__ == '__main__':
    app.run(debug=True)