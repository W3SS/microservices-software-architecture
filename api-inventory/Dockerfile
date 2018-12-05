FROM python:2.7
ADD . /api-inventory
WORKDIR /api-inventory
RUN pip install -r requirements.txt
CMD ["python", "app/inventory_api.py"]