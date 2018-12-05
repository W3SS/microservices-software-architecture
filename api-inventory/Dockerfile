FROM python:2.7
ADD . /api-inventory
WORKDIR /api-inventory
RUN pip install -r requirements.txt
CMD ["python", "inventory_api.py"]