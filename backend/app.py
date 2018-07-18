#!/usr/bin/env python
from flask import Flask, jsonify, request, abort
from backend.database_service.database_service import DatabaseService
from email_validator import validate_email, EmailNotValidError
from database_service.models.item import Item
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, \
    get_raw_jwt

import httplib2
import datetime
import time
import json

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)


@app.after_request
def apply_caching(response):
    """
    Set Access Control for the client code
    """
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
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
    db_service = DatabaseService()
    user = db_service.get_user_by_username(username)

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

        db_service = DatabaseService()
        user = db_service.get_user_by_email(user_email)

        if not user:
            db_service.save_new_user_by_email(user_email)

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

    db_service = DatabaseService()

    if db_service.is_username_exists(username):
        return jsonify({'msg': 'user already exists'}), 200

    db_service.save_new_user(username=username, password=password, email=email)
    return jsonify({'msg': 'user successfully created'}), 201


@app.route('/all', methods=['GET'])
def get_all():
    """
    Endpoint provides all categories with associated items
    :return: categories with items in json
    """
    db_service = DatabaseService()
    items = db_service.get_all_items()
    categories = db_service.get_all_categories()

    items_dict = dict()
    for item in items:
        if item['cat_id'] in items_dict.keys():
            items_dict[item['cat_id']].append(item)
        else:
            items_dict[item['cat_id']] = [item]

    for category in categories:
        if category['id'] in items_dict.keys():
            category['item'] = items_dict[category['id']]

    return jsonify({'category': categories}), 200


@app.route('/categories', methods=['GET'])
def get_categories():
    """
    Endpoint provides all categories
    :return: all categories in json
    """
    db_service = DatabaseService()
    categories = db_service.get_all_categories()
    return jsonify({'categories': categories}), 200


@app.route('/category', methods=['GET'])
def get_category():
    """
    Endpoint returns a requested category by id
    :param id: category id
    :return: category in json
    """
    id = request.args.get('id')

    if id is not None:
        db_service = DatabaseService()
        category = db_service.get_category_by_id(id)

        if category is not None:
            return jsonify({'category': category}), 200
        else:
            return jsonify({'msg': 'parameters are missing'}), 400
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/categoryItems', methods=['GET'])
def get_category_items():
    """
    Endpoint returns items associated with a certain category
    by category id or category name
    :param categoryId: category id
    :param categoryName: category name
    :return: items in json
    """
    category_id = request.args.get('categoryId')
    category_name = request.args.get('categoryName')

    if category_id is not None:
        db_service = DatabaseService()
        items = db_service.get_items_by_category_id(cat_id=category_id)

        if items is not None:
            return jsonify({'items': items}), 200
        else:
            return jsonify({'msg': 'parameters are missing'}), 400
    elif category_name is not None:
        db_service = DatabaseService()
        items = db_service.get_items_by_category_name(category_name)

        if items is not None:
            return jsonify({'items': items}), 200
        else:
            return jsonify({'msg': 'parameters are missing'}), 400
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/items', methods=['GET'])
def get_items():
    """
    Endpoint returns all items or latest added items if 'latest' is true
    :param latest: boolean value
    :return: items in json
    """
    latest = request.args.get('latest')
    db_service = DatabaseService()

    if latest == u'true':
        categories = db_service.get_all_categories()
        items = db_service.get_latest_items(6)
        categories_dict = dict()

        for category in categories:
            if category['id'] in categories_dict.keys():
                categories_dict[category['id']].append(category)
            else:
                categories_dict[category['id']] = category

        for item in items:
            if item['cat_id'] in categories_dict.keys():
                item['categoryName'] = categories_dict[item['cat_id']]['name']

    else:
        items = db_service.get_all_items()

    return jsonify({'items': items}), 200


@app.route('/item', methods=['GET'])
def get_item():
    """
    Endpoint returns an item by id or by name
    :param itemId: item id
    :param itemName: item name
    :return: item in json
    """
    item_id = request.args.get('itemId')
    item_name = request.args.get('itemName')

    if item_id is not None:
        db_service = DatabaseService()
        item = db_service.get_item_by_id(item_id)

        if item is not None:
            return jsonify({'item': item}), 200
        else:
            return jsonify({'msg': 'item does not exist'}), 400
    elif item_name is not None:
        db_service = DatabaseService()
        item = db_service.get_item_by_name(item_name)

        if item is not None:
            return jsonify({'item': item}), 200
        else:
            return jsonify({'msg': 'item does not exist'}), 400
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/item', methods=['PUT'])
@jwt_required
def update_item():
    """
    Endpoint updates existing item
    :param id: item id
    :param itemName: item name
    :param description: item description
    :param cat_id: item category id
    :return: success message
    """
    content = request.get_json()
    id = content['id']
    name = content['name']
    description = content['description']
    cat_id = content['cat_id']
    item = Item(id=id, name=name, description=description, cat_id=cat_id)

    if id is not None:
        db_service = DatabaseService()

        if db_service.update_item_by_id(item) is True:
            return jsonify({'msg': 'successfully updated'}), 200
        else:
            return jsonify({'msg': 'parameters are missing'}), 400
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/item', methods=['DELETE'])
@jwt_required
def delete_item():
    """
    Endpoint deletes item
    :param id: item id
    :return: success message
    """
    id = request.args.get('id')

    if id is not None:
        db_service = DatabaseService()

        if db_service.delete_item_by_id(id) is True:
            return jsonify({'msg': 'successfully deleted'}), 200
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/item', methods=['POST'])
@jwt_required
def add_item():
    """
    Endpoint creates a new item
    :param name: item name
    :param description: item description
    :param cat_id: item category id
    :return: success message
    """
    content = request.get_json()
    name = content['name']
    description = content['description']
    cat_id = content['cat_id']

    if name is None or description is None or cat_id is None:
        return jsonify({'msg': 'parameters are missing'}), 400

    item = Item(name=name, description=description, cat_id=cat_id)
    db_service = DatabaseService()

    if db_service.save_new_item(item) is True:
        return jsonify({'msg': 'successfully added'}), 201
    else:
        return jsonify({'msg': 'exception while saving a new item'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
