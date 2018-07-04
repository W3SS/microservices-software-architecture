from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from passlib.apps import custom_app_context as pwd_context
from marshmallow_sqlalchemy import ModelSchema
from sqlalchemy.orm import relationship

import random
import string

Base = declarative_base()
secret_key = ''.join(random.choice(string.ascii_uppercase +
                                   string.digits) for x in xrange(32))


class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String(32), index=True)
    password_hash = Column(String(64))
    email = Column(String(254))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)


class Category(Base):
    __tablename__ = 'category'
    id = Column(Integer, primary_key=True)
    name = Column(String)


class CategorySchema(ModelSchema):
    class Meta:
        model = Category


class Item(Base):
    __tablename__ = 'item'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    cat_id = Column(Integer)#, ForeignKey('category.id'))
    description = Column(Text)
    # category = relationship('Category', backref='items')


class ItemSchema(ModelSchema):
    class Meta:
        model = Item


engine = create_engine('sqlite:///database.db')
Base.metadata.create_all(engine)
