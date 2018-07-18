from sqlalchemy import Column, Integer, String
from sqlalchemy_dao import Model
from passlib.apps import custom_app_context as pwd_context


class User(Model):
    id = Column(Integer, primary_key=True)
    username = Column(String(32), index=True)
    password_hash = Column(String(64))
    email = Column(String(254))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)