from sqlalchemy import Column, Integer, String
from sqlalchemy_dao import Model
from marshmallow_sqlalchemy import ModelSchema


class Category(Model):
    """
    Catalog app's category, stored in database.db
    """
    id = Column(Integer, primary_key=True)
    name = Column(String)


class CategorySchema(ModelSchema):
    """
    Category serializer
    """
    class Meta:
        model = Category
