#!/usr/bin/env
from models.category import Category, CategorySchema
from models.item import Item, ItemSchema
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists


class CategoryDao(object):
    """
    Provides a layer which has an access to a database.
    Serves all the data operations.
    """
    session = None

    def __init__(self):
        """
        Establishes a database connection
        """
        conn_args = {'check_same_thread': False}

        if database_exists('sqlite:///api-inventory/repository/database.db'):
            engine = create_engine(
                'sqlite:///api-inventory/repository/database.db',
                connect_args=conn_args)
        elif database_exists('sqlite:///repository/database.db'):
            engine = create_engine(
                'sqlite:///repository/database.db',
                connect_args=conn_args)
        else:
            raise Exception('No database file')

        Base = declarative_base()
        Base.metadata.bind = engine
        DBSession = sessionmaker(bind=engine)
        self.session = DBSession()

    def get_all_categories(self):
        try:
            categories_raw = self.session.query(Category).all()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        category_schema = CategorySchema(many=True)
        categories = category_schema.dump(categories_raw).data
        return categories

    def get_category_by_id(self, id):
        try:
            category_raw = self.session.query(Category).filter_by(id=id).one()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()

        if category_raw is not None:
            category_schema = CategorySchema()
            category = category_schema.dump(category_raw).data
            return category
        else:
            return None
