#!/usr/bin/env
from flask import json
from inventory_api import app


def test_get_all():
    response = app.test_client().get('/all')
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data) > 0


def test_get_item_by_id():
    response = app.test_client().get('/item', query_string={'itemId': '2'})
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert data['item']['id'] == 2
    assert data['item']['name'] == 'Backboard'
    assert data['item']['description'] is not None


def test_get_latest_items():
    response = app.test_client().get('/items', query_string={'latest': 'true'})
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data['items']) == 6


def test_get_category_by_id():
    response = app.test_client().get('/category', query_string={'id': '2'})
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert data['category']['id'] == 2
    assert data['category']['name'] == 'Basketball'


def test_get_category_items_by_id():
    response = app.test_client().get('/categoryItems', query_string={'categoryId': '2'})
    data = json.loads(response.get_data(as_text=True))

    assert response.status_code == 200
    assert len(data['items']) > 0
    assert data['items'][0]['name'] == 'Backboard'


if __name__ == '__main__':
    app.config['DEBUG'] = True
    app.config['TESTING'] = True

    test_get_all()
    test_get_item_by_id()
    test_get_latest_items()
    test_get_category_by_id()
    test_get_category_items_by_id()
