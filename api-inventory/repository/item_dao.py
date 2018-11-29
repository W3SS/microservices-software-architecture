#!/usr/bin/env
from models.category import Category
from models.item import Item, ItemSchema
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists


class ItemDao(object):
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

    def get_all_items(self):
        try:
            items_raw = self.session.query(Item).all()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_latest_items(self, limit):
        try:
            items_raw = self.session.query(Item)\
                .order_by(desc(Item.id))\
                .limit(limit)\
                .all()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()

        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_items_by_category_id(self, cat_id):
        try:
            items_raw = self.session.query(Item).filter_by(cat_id=cat_id)
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_items_by_category_name(self, category_name):
        try:
            category = self.session.query(Category)\
                .filter_by(name=category_name)\
                .one()

            items_raw = self.session.query(Item)\
                .filter_by(cat_id=category.id)
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        item_schema = ItemSchema(many=True)
        items = item_schema.dump(items_raw).data
        return items

    def get_item_by_id(self, id):
        try:
            item = self.session.query(Item).filter_by(id=id).one()
            item_schema = ItemSchema()
            data = item_schema.dump(item).data
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return data

    def get_item_by_name(self, name):
        try:
            item = self.session.query(Item).filter_by(name=name).one()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        item_schema = ItemSchema()
        data = item_schema.dump(item).data
        return data

    def update_item_by_id(self, item):
        try:
            db_item = self.session.query(Item).filter_by(id=item.id).one()

            if db_item is None:
                return None

            if item is not None:
                if item.name is not None:
                    db_item.name = item.name
                if item.description is not None:
                    db_item.description = item.description
                if item.cat_id is not None:
                    db_item.cat_id = item.cat_id

            self.session.commit()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return True

    def delete_item_by_id(self, id):
        try:
            self.session.query(Item).filter_by(id=id).delete()
            self.session.commit()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return True

    def save_new_item(self, item):
        try:
            db_item = self.get_item_by_id(item.id)
            if db_item is not None:
                return None
            else:
                self.session.add(item)
                self.session.commit()

        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return True
