import httplib2
import json
from flask import jsonify


class InventoryService(object):

    service_url = None
    headers = None

    def __init__(self):
        key = 'secret.api.key'
        self.service_url = 'http://localhost:5001/'
        self.headers = {'x-api-key': key,
                        'Content-Type': 'application/json; charset=UTF-8'}

    def get_category_by_id(self):
        url = self.service_url + 'item'
        try:
            h = httplib2.Http()
            result = json.loads(h.request(url, 'GET', headers=self.headers)[1])
        except Exception as ex:
            return None
        if result.get('error') is not None:
            error_message = json.dumps(result.get('error'))
            return error_message
        else:
            return result['msg']

    def add_item(self, item):
        url = self.service_url + 'item'
        try:
            h = httplib2.Http()
            result = json.loads(h.request(
                uri=url,
                method='POST',
                body=jsonify(item),
                headers=self.headers)[1])
        except Exception as ex:
            return None
        if result.get('error') is not None:
            error_message = json.dumps(result.get('error'))
            return error_message
        else:
            return result['msg']
