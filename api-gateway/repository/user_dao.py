#!/usr/bin/env
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy_utils import database_exists

from models.user import User


class UserDao(object):
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

        if database_exists('sqlite:///api-gateway/repository/database.db'):
            engine = create_engine(
                'sqlite:///api-gateway/repository/database.db',
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
