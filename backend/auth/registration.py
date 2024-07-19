import bcrypt
from flask import (Blueprint, jsonify, make_response, redirect,
                   render_template, request)
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                set_access_cookies, set_refresh_cookies)

registration_bp = Blueprint("registration", __name__)

@registration_bp.route("/login_user", methods=["POST"])
def login_user():

     #Pull JSON data from request
    data = request.get_json()

    #login validation 
    if data:
        email_ = data.get('email')
        password_ = data.get('password')

        user_object = None#Users.query.filter_by(email = email_).first()

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