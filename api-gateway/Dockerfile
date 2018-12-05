FROM python:2.7
ADD . /api-gateway
WORKDIR /api-gateway
RUN pip install -r requirements.txt
CMD ["python", "app.py"]