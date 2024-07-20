from datetime import *

import bcrypt
from extensions import bcrypt, db
from flask import (Blueprint, json, jsonify, make_response, redirect,
                   render_template, request)
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                get_jwt, get_jwt_identity, jwt_required,
                                set_access_cookies, set_refresh_cookies,
                                unset_jwt_cookies)
from models.Users import Users

from .password_reset_email import password_reset_email

registration_bp = Blueprint("registration", __name__)

# /signup_user
# # Adds new login credentials to database
@registration_bp.route("/signup_user", methods=["POST"])
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

@registration_bp.route("/login_user", methods=["POST"])
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
@registration_bp.route("/logout_user", methods=["GET"])
def logout_user():

    response = jsonify({"message": "Logout Successful"})
    unset_jwt_cookies(response)

    return response

@registration_bp.route("/fetch_credentials")
@jwt_required()
def fetch_credentials():
    current_user_identity = get_jwt_identity()

    user_object = Users.query.filter_by(email= current_user_identity).first()

    response = {
        "email": user_object.email,
    }

    return jsonify(response)    

@registration_bp.route("/confirm_password", methods=["POST"])
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
    
@registration_bp.route("/change_email", methods=["POST"])
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
    
@registration_bp.route("/change_password", methods=["POST"])
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
    
@registration_bp.route("/verify_email", methods=["POST"])
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

@registration_bp.route("/generate_recovery_url", methods=["POST"])
def generate_recovery_url():
    data = request.get_json()

    if data:

        email_ = data.get("email")

        user_object = Users.query.filter_by(email= email_).first()

        password_reset_email(user_object)
        
        return jsonify({"message": "URL_generated"}), 200

    else: 
        return jsonify({"message": "No data received!"}), 400

@registration_bp.route("/reset_password/<token>/<int:user_id>", methods=["POST"])
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
                db.session.commit()
                return jsonify({"message": "Token valid - Password has been changed"}), 200   
    
        else:
            # print("Invalid or Expired Token")
            return jsonify({"message": "Invalid or Expired Token"}), 200 
    else: 
        return jsonify({"message": "No data received"}), 200 
    
@registration_bp.after_request
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
    
   