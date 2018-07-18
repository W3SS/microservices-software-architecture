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
    Serves all the data operations.
    """
    session = None

    def __init__(self):
        """
        Establishes a database connection
        """
        engine = create_engine(
            'sqlite:///backend/database_service/database.db',
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
            return None
        finally:
            self.session.close()
        category_schema = CategorySchema(many=True)
        categories = category_schema.dump(categories_raw).data
        return categories

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

    def get_user_by_username(self, username):
        try:
            user = self.session.query(User)\
                .filter_by(username=username)\
                .first()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return user

    def get_user_by_email(self, user_email):
        try:
            user = self.session.query(User).filter_by(email=user_email).first()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return user

    def save_new_user_by_email(self, user_email):
        user = User(email=user_email)

        try:
            self.session.add(user)
            self.session.commit()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()

    def is_username_exists(self, username):
        try:
            user = self.session.query(User)\
                .filter_by(username=username)\
                .first()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()
        return user is not None

    def save_new_user(self, username, password, email):
        user = User(username=username, email=email)
        user.hash_password(password)

        try:
            self.session.add(user)
            self.session.commit()
        except Exception:
            self.session.rollback()
            return None
        finally:
            self.session.close()

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
