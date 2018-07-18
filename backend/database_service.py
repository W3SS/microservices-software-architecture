#!/usr/bin/env
from models import Base, Category, CategorySchema
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine


class DatabaseService(object):
    session = None

    def __init__(self):
        engine = create_engine('sqlite:///database.db',
                               connect_args={'check_same_thread': False})

        Base.metadata.bind = engine
        DBSession = sessionmaker(bind=engine)
        self.session = DBSession()

    def get_all_categories(self):
        categories_raw = self.session.query(Category).all()
        category_schema = CategorySchema(many=True)
        categories = category_schema.dump(categories_raw).data
        return categories
