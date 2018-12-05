#!/usr/bin/env python
import datetime
import json
import time

import httplib2
from email_validator import validate_email, EmailNotValidError
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, \
    get_raw_jwt

from repository.user_dao import UserDao

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)


@app.after_request
def apply_caching(response):
    """
    Set Access Control for the client code
    """
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
    response.headers['Access-Control-Allow-Headers'] = \
        'Content-Type, Authorization'
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@jwt.expired_token_loader
def my_expired_token_callback():
    """
    Using the expired_token_loader decorator, we will now call
    this function whenever an expired but otherwise valid access
    token attempts to access an endpoint
    """
    return jsonify({
        'status': 401,
        'sub_status': 42,
        'msg': 'The token has expired'
    }), 401


@app.route('/login', methods=['POST'])
def login():
    """
    Allows an existing user to login.

    :param username: registered username
    :param password: user's password
    :return: returns token and expiration time
    """
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    user_dao = UserDao()
    user = user_dao.get_user_by_username(username)

    if not user or not user.verify_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    expires = datetime.timedelta(minutes=30)
    exp_time = int(round(time.time())) + expires.total_seconds()
    token = create_access_token(username, expires_delta=expires)
    return jsonify({'token': token, 'exp': exp_time}), 200


@app.route('/logout', methods=['DELETE'])
@jwt_required
def logout():
    """
    Endpoint for revoking the current users access token
    :return: success message and code
    """
    jti = get_raw_jwt()['jti']
    return jsonify({"msg": "Successfully logged out"}), 200


@app.route('/oauth', methods=['POST'])
def oauth_login():
    """
    Allows a user to login using a token which is provided by Google,
    if it is valid, then access is allowed otherwise server throws an exception

    :param provider: token provider, in this case is google
    :param token: a token from google
    :param email: email from user's google account
    :return: returns token and expiration time
    """
    provider = request.args.get('provider')
    access_token = request.json.get('token')
    user_email = request.json.get('email')

    if provider == 'google':
        url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
               % access_token)
        h = httplib2.Http()
        result = json.loads(h.request(url, 'GET')[1])

        if result.get('error') is not None:
            error_message = json.dumps(result.get('error'))
            return jsonify({'msg': error_message.strip('\"')}), 500

        user_dao = UserDao()
        user = user_dao.get_user_by_email(user_email)

        if not user:
            user_dao.save_new_user_by_email(user_email)

        expires = datetime.timedelta(seconds=result.get('expires_in'))
        exp_time = int(round(time.time())) + expires.total_seconds()
        token = create_access_token(user_email, expires_delta=expires)
        return jsonify({'token': token, 'exp': exp_time}), 200
    else:
        return jsonify({'msg': 'unrecognized provider'}), 400


@app.route('/logout/oauth', methods=['DELETE'])
@jwt_required
def oauth_logout():
    """
    Endpoint for revoking the current users access token
    which has been provided by google
    """
    provider = request.args.get('provider')
    token = request.json.get('token')

    if token is None:
        return jsonify({'msg': 'Current user not connected.'}), 401

    if provider == 'google':
        url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % token
        h = httplib2.Http()
        result = h.request(url, 'GET')[0]

        if result['status'] == '200':
            jti = get_raw_jwt()['jti']
            return jsonify({"msg": "Successfully logged out"}), 200
        else:
            return jsonify(
                {'msg': 'Failed to revoke token for given user'}), 400
    else:
        return jsonify({'msg': 'unrecognized provider'}), 400


@app.route('/register', methods=['POST'])
def new_user():
    """
    Endpoint for a user registration
    :param username: user's name
    :param password: user's password
    :param email: user's email
    :return: success message
    """
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    try:
        validate_email(email)
    except EmailNotValidError:
        return jsonify({'msg': 'email is not valid'}), 400

    if username is None or password is None or email is None:
        return jsonify({'msg': 'missing arguments'}), 400

    user_dao = UserDao()

    if user_dao.is_username_exists(username):
        return jsonify({'msg': 'user already exists'}), 200

    user_dao.save_new_user(username=username, password=password, email=email)
    return jsonify({'msg': 'user successfully created'}), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
