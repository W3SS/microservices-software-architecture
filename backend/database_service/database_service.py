#!/usr/bin/env
from models.category import Category, CategorySchema
from models.user import User
from models.item import Item, ItemSchema
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, desc
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
        try:
            categories_raw = self.session.query(Category).all()
        except Exception:
            self.session.rollback()
            raise
        finally:
            self.session.close()
        category_schema = CategorySchema(many=True)
        categories = category_schema.dump(categories_raw).data
        return categories

    def get_all_items(self):
        items_raw = self.session.query(Item).all()
        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_latest_items(self, limit):
        items_raw = self.session.query(Item)\
            .order_by(desc(Item.id))\
            .limit(limit)\
            .all()

        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

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

    def get_category_by_id(self, id):
        category_raw = self.session.query(Category).filter_by(id=id).one()

        if category_raw is not None:
            category_schema = CategorySchema()
            category = category_schema.dump(category_raw).data
            return category
        else:
            return None

    def get_items_by_category_id(self, cat_id):
        items_raw = self.session.query(Item).filter_by(cat_id=cat_id)
        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_items_by_category_name(self, category_name):
        category = self.session.query(Category)\
            .filter_by(name=category_name)\
            .one()

        items_raw = self.session.query(Item).filter_by(cat_id=category.id)
        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_item_by_id(self, id):
        item = self.session.query(Item).filter_by(id=id).one()
        item_schema = ItemSchema()
        data = item_schema.dump(item).data
        return data

    def get_item_by_name(self, name):
        item = self.session.query(Item).filter_by(name=name).one()
        item_schema = ItemSchema()
        data = item_schema.dump(item).data
        return data
