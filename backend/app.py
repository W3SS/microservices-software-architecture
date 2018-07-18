#!/usr/bin/env python
from flask import Flask, jsonify
from backend.database_service.database_service import DatabaseService
from flask_jwt_extended import (
    JWTManager
)

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
jwt = JWTManager(app)


# Set Access Control for the client
# @app.after_request
# def apply_caching(response):
#     response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8000'
#     response.headers['Access-Control-Allow-Headers'] = \
#         'Content-Type, Authorization'
#     response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
#     return response
#
#
# # Using the expired_token_loader decorator, we will now call
# # this function whenever an expired but otherwise valid access
# # token attempts to access an endpoint
# @jwt.expired_token_loader
# def my_expired_token_callback():
#     return jsonify({
#         'status': 401,
#         'sub_status': 42,
#         'msg': 'The token has expired'
#     }), 401
#
#
# @app.route('/login', methods=['POST'])
# def login():
#     username = request.json.get('username', None)
#     password = request.json.get('password', None)
#     user = session.query(User).filter_by(username=username).first()
#
#     if not user or not user.verify_password(password):
#         return jsonify({"msg": "Bad username or password"}), 401
#
#     expires = datetime.timedelta(minutes=30)
#     exp_time = int(round(time.time())) + expires.total_seconds()
#     token = create_access_token(username, expires_delta=expires)
#     return jsonify({'token': token, 'exp': exp_time}), 200
#
#
# # Endpoint for revoking the current users access token
# @app.route('/logout', methods=['DELETE'])
# @jwt_required
# def logout():
#     jti = get_raw_jwt()['jti']
#     return jsonify({"msg": "Successfully logged out"}), 200
#
#
# @app.route('/oauth', methods=['POST'])
# def oauth_login():
#     provider = request.args.get('provider')
#     access_token = request.json.get('token')
#     user_email = request.json.get('email')
#
#     if provider == 'google':
#         url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s'
#                % access_token)
#         h = httplib2.Http()
#         result = json.loads(h.request(url, 'GET')[1])
#
#         if result.get('error') is not None:
#             error_message = json.dumps(result.get('error'))
#             return jsonify({'msg': error_message.strip('\"')}), 500
#
#         user = session.query(User).filter_by(email=user_email).first()
#
#         if not user:
#             user = User(email=user_email)
#             session.add(user)
#             session.commit()
#
#         expires = datetime.timedelta(seconds=result.get('expires_in'))
#         exp_time = int(round(time.time())) + expires.total_seconds()
#         token = create_access_token(user_email, expires_delta=expires)
#         return jsonify({'token': token, 'exp': exp_time}), 200
#     else:
#         return jsonify({'msg': 'unrecognized provider'}), 400
#
#
# @app.route('/logout/oauth', methods=['DELETE'])
# @jwt_required
# def oauth_logout():
#     provider = request.args.get('provider')
#     token = request.json.get('token')
#
#     if token is None:
#         return jsonify({'msg': 'Current user not connected.'}), 401
#
#     if provider == 'google':
#         url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % token
#         h = httplib2.Http()
#         result = h.request(url, 'GET')[0]
#
#         if result['status'] == '200':
#             jti = get_raw_jwt()['jti']
#             return jsonify({"msg": "Successfully logged out"}), 200
#         else:
#             return jsonify({'msg': 'Failed to revoke token for given user'}), 400
#     else:
#         return jsonify({'msg': 'unrecognized provider'}), 400
#
#
# @app.route('/register', methods=['POST'])
# def new_user():
#     username = request.json.get('username')
#     password = request.json.get('password')
#     email = request.json.get('email')
#
#     try:
#         validate_email(email)
#     except EmailNotValidError:
#         return jsonify({'msg': 'email is not valid'}), 400
#
#     if username is None or password is None or email is None:
#         return jsonify({'msg': 'missing arguments'}), 400
#
#     if session.query(User).filter_by(username=username).first() is not None:
#         return jsonify({'msg': 'user already exists'}), 200
#
#     user = User(username=username, email=email)
#     user.hash_password(password)
#     session.add(user)
#     session.commit()
#     return jsonify({'username': user.username, 'userId': user.id}), 201
#
#
# @app.route('/users/<int:id>', methods=['GET'])
# def get_user(id):
#     user = session.query(User).filter_by(id=id).one()
#
#     if not user:
#         abort(400)
#     return jsonify({'username': user.username})
#
#
# @app.route('/protected', methods=['GET'])
# @jwt_required
# def protected():
#     return jsonify({'hello': 'world'}), 200
#
#
# @app.route('/all', methods=['GET'])
# def get_all():
#     items_raw = session.query(Item).all()
#     item_schema = ItemSchema(many=True)
#     items = item_schema.dump(items_raw).data
#
#     categories_raw = session.query(Category).all()
#     category_schema = CategorySchema(many=True)
#     categories = category_schema.dump(categories_raw).data
#
#     items_dict = dict()
#     for item in items:
#         if item['cat_id'] in items_dict.keys():
#             items_dict[item['cat_id']].append(item)
#         else:
#             items_dict[item['cat_id']] = [item]
#
#     for category in categories:
#         if category['id'] in items_dict.keys():
#             category['item'] = items_dict[category['id']]
#
#     return jsonify({'category': categories}), 200


@app.route('/categories', methods=['GET'])
def get_categories():
    db_service = DatabaseService()
    categories = db_service.get_all_categories()
    return jsonify({'categories': categories}), 200


# @app.route('/category', methods=['GET'])
# def get_category():
#     id = request.args.get('id')
#
#     if id is not None:
#         category_raw = session.query(Category).filter_by(id=id).one()
#     else:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     category_schema = CategorySchema()
#     category = category_schema.dump(category_raw).data
#     return jsonify({'category': category}), 200
#
#
# @app.route('/categoryItems', methods=['GET'])
# def get_category_items():
#     category_id = request.args.get('categoryId')
#     category_name = request.args.get('categoryName')
#
#     if category_id is not None:
#         items = session.query(Item).filter_by(cat_id=category_id)
#     elif category_name is not None:
#         category = session.query(Category).filter_by(name=category_name).one()
#         items = session.query(Item).filter_by(cat_id=category.id)
#     else:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     item_schema = ItemSchema(many=True)
#     data = item_schema.dump(items).data
#     return jsonify({'items': data}), 200
#
#
# @app.route('/items', methods=['GET'])
# def get_items():
#     latest = request.args.get('latest')
#
#     if latest == u'true':
#         categories_raw = session.query(Category).all()
#         category_schema = CategorySchema(many=True)
#         categories = category_schema.dump(categories_raw).data
#
#         items_raw = session.query(Item).order_by(desc(Item.id)).limit(6).all()
#         item_schema = ItemSchema(many=True)
#         items = item_schema.dump(items_raw).data
#         categories_dict = dict()
#
#         for category in categories:
#             if category['id'] in categories_dict.keys():
#                 categories_dict[category['id']].append(category)
#             else:
#                 categories_dict[category['id']] = category
#
#         for item in items:
#             if item['cat_id'] in categories_dict.keys():
#                 item['categoryName'] = categories_dict[item['cat_id']]['name']
#
#     else:
#         items = session.query(Item).all()
#
#     return jsonify({'items': items}), 200
#
#
# @app.route('/item', methods=['GET'])
# def get_item():
#     item_id = request.args.get('itemId')
#     item_name = request.args.get('itemName')
#
#     if item_id is not None:
#         item = session.query(Item).filter_by(id=item_id).one()
#     elif item_name is not None:
#         item = session.query(Item).filter_by(name=item_name).one()
#     else:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     item_schema = ItemSchema()
#     data = item_schema.dump(item).data
#     return jsonify({'item': data}), 200
#
#
# @app.route('/item', methods=['PUT'])
# @jwt_required
# def update_item():
#     content = request.get_json()
#     id = content['id']
#     name = content['name']
#     description = content['description']
#     cat_id = content['cat_id']
#
#     if id is not None:
#         item = session.query(Item).filter_by(id=id).one()
#
#         if item is not None:
#             if name is not None:
#                 item.name = name
#             if description is not None:
#                 item.description = description
#             if cat_id is not None:
#                 item.cat_id = cat_id
#
#             session.commit()
#         else:
#             return jsonify({'msg': 'parameters are missing'}), 400
#     else:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     return jsonify({'msg': 'successfully updated'}), 200
#
#
# @app.route('/item', methods=['DELETE'])
# @jwt_required
# def delete_item():
#     id = request.args.get('id')
#
#     if id is not None:
#         session.query(Item).filter_by(id=id).delete()
#         session.commit()
#     else:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     return jsonify({'msg': 'successfully deleted'}), 200
#
#
# @app.route('/item', methods=['POST'])
# @jwt_required
# def add_item():
#     content = request.get_json()
#     name = content['name']
#     description = content['description']
#     cat_id = content['cat_id']
#
#     if name is None or description is None or cat_id is None:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     category = session.query(Category).filter_by(id=cat_id).one()
#
#     if category is None:
#         return jsonify({'msg': 'parameters are missing'}), 400
#
#     item = Item(name=name, description=description, cat_id=cat_id)
#     session.add(item)
#     session.commit()
#     return jsonify({'msg': 'successfully added'}), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)
