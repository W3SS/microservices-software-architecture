#!/usr/bin/env
from models.category import Category, CategorySchema
from models.user import User
from models.item import Item, ItemSchema
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base


class DatabaseService(object):
    """
    Provides a layer which has an access to a database.
    Serves all data operations.
    """
    session = None

    def __init__(self):
        """
        Establishes a database connection
        """
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

    def get_user_by_email(self, user_email):
        user = self.session.query(User).filter_by(email=user_email).first()
        return user

    def save_new_user_by_email(self, user_email):
        user = User(email=user_email)
        self.session.add(user)
        self.session.commit()

    def is_username_exists(self, username):
        user = self.session.query(User).filter_by(username=username).first()
        return user is not None

    def save_new_user(self, username, password, email):
        user = User(username=username, email=email)
        user.hash_password(password)
        self.session.add(user)
        self.session.commit()
