#!/usr/bin/env
from models . category import Category, CategorySchema
from models . user import User
from models . item import Item, ItemSchema
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base


class DatabaseService(object):
    session = None

    def __init__(self):
        engine = create_engine('sqlite:///database.db',
                               connect_args={'check_same_thread': False})

        Base = declarative_base()
        Base.metadata.bind = engine
        DBSession = sessionmaker(bind=engine)
        self.session = DBSession()

    def get_all_categories(self):
        categories_raw = self.session.query(Category).all()
        category_schema = CategorySchema(many=True)
        categories = category_schema.dump(categories_raw).data
        return categories

    def get_user_by_username(self, username):
        user = self.session.query(User).filter_by(username=username).first()
        return user
