#!/usr/bin/env
from flask import json
from inventory_api import app


def test_add():
    client = app.test_client()
    response = client.get(
        '/all',
        # data=json.dumps({'a': 1, 'b': 2}),
        # content_type='application/json'
    )

    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    # assert data['sum'] == 3


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.config['TESTING'] = True
    app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False

    test_add()
