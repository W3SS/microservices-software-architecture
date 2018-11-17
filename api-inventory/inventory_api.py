#!/usr/bin/env python
from flask import Flask, jsonify, request
from functools import wraps

import httplib2
import datetime
import time
import json

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Change this!
key = 'secret.api.key'


def api_key_required(f):
    @wraps(f)
    def validate_api_key(*args, **kwargs):
        if request.headers.get('x-api-key') == key:
            return f()
        else:
            return jsonify({'msg': 'api key required'}), 401
    return validate_api_key


@app.route('/item', methods=['GET'])
@api_key_required
def get_item():
    """
    Endpoint returns an item by id or by name
    :param itemId: item id
    :param itemName: item name
    :return: item in json
    """
    return jsonify({'msg': 'here is your item'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, threaded=True)
