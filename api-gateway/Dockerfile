FROM python:2.7
MAINTAINER Aleksandr Madisson "aleksandr.madisson@linnsystems.com"
ADD . /api-gateway
WORKDIR /api-gateway
RUN pip install -r requirements.txt
CMD ["python", "app.py"]