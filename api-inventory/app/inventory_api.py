#!/usr/bin/env python
from flask import Flask, jsonify, request
from functools import wraps
from repository.item_dao import ItemDao
from repository.category_dao import CategoryDao
from repository.models.item import Item


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False
key = 'secret.api.key'


def api_key_required(f):
    @wraps(f)
    def validate_api_key(*args, **kwargs):
        if request.headers.get('X-Api-Key') == key:
            return f()
        else:
            return jsonify({'msg': 'api key required'}), 401
    return validate_api_key


@app.after_request
def apply_caching(response):
    """
    Set Access Control for the client code
    """
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:8080'
    response.headers['Access-Control-Allow-Headers'] = \
        'Content-Type, Authorization, X-Api-Key'
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response


@app.route('/all', methods=['GET'])
def get_all():
    """
    Endpoint provides all categories with associated items
    :return: categories with items in json
    """

    item_dao = ItemDao()
    category_dao = CategoryDao()
    items = item_dao.get_all_items()
    categories = category_dao.get_all_categories()

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
    category_dao = CategoryDao()
    categories = category_dao.get_all_categories()
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
        category_dao = CategoryDao()
        category = category_dao.get_category_by_id(id)

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
        item_dao = ItemDao()
        items = item_dao.get_items_by_category_id(cat_id=category_id)

        if items is not None:
            return jsonify({'items': items}), 200
        else:
            return jsonify({'msg': 'parameters are missing'}), 400
    elif category_name is not None:
        item_dao = ItemDao()
        items = item_dao.get_items_by_category_name(category_name)

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
    item_dao = ItemDao()
    category_dao = CategoryDao()

    if latest == u'true':
        categories = category_dao.get_all_categories()
        items = item_dao.get_latest_items(6)
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
        items = item_dao.get_all_items()

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
        item_dao = ItemDao()
        item = item_dao.get_item_by_id(item_id)

        if item is not None:
            return jsonify({'item': item}), 200
        else:
            return jsonify({'msg': 'item does not exist'}), 400
    elif item_name is not None:
        item_dao = ItemDao()
        item = item_dao.get_item_by_name(item_name)

        if item is not None:
            return jsonify({'item': item}), 200
        else:
            return jsonify({'msg': 'item does not exist'}), 400
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/item', methods=['PUT'])
@api_key_required
# @jwt_required
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
        item_dao = ItemDao()

        if item_dao.update_item_by_id(item) is True:
            return jsonify({'msg': 'successfully updated'}), 200
        else:
            return jsonify({'msg': 'parameters are missing'}), 400
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/item', methods=['DELETE'])
@api_key_required
# @jwt_required
def delete_item():
    """
    Endpoint deletes item
    :param id: item id
    :return: success message
    """
    id = request.args.get('id')

    if id is not None:
        item_dao = ItemDao()

        if item_dao.delete_item_by_id(id) is True:
            return jsonify({'msg': 'successfully deleted'}), 200
    else:
        return jsonify({'msg': 'parameters are missing'}), 400


@app.route('/item', methods=['POST'])
@api_key_required
# @jwt_required
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
    item_dao = ItemDao()

    if item_dao.save_new_item(item) is True:
        return jsonify({'msg': 'successfully added'}), 201
    else:
        return jsonify({'msg': 'exception while saving a new item'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)
