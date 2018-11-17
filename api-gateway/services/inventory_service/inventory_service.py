import httplib2
import json


class InventoryService(object):

    service_url = None
    headers = None

    def __init__(self):
        key = 'secret.api.key'
        self.service_url = 'http://localhost:5001/'
        self.headers = {'x-api-key': key}

    def get_category_by_id(self):
        url = self.service_url + 'item'
        h = httplib2.Http()
        try:
            result = json.loads(h.request(url, 'GET', headers=self.headers)[1])
        except Exception as ex:
            return None
        if result.get('error') is not None:
            error_message = json.dumps(result.get('error'))
            return error_message
        else:
            return result['msg']
