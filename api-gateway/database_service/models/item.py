from sqlalchemy import Column, Integer, String, Text
from sqlalchemy_dao import Model
from marshmallow_sqlalchemy import ModelSchema


class Item(Model):
    """
    Catalog app's item, each item associated with a category,
    stored in database.db
    """
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True)
    name = Column(String)
    cat_id = Column(Integer)
    description = Column(Text)


class ItemSchema(ModelSchema):
    """
    Item serializer
    """
    class Meta:
        model = Item
