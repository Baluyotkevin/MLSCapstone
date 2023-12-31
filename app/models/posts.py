from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from .loves import love
from .comments import Comment
from .favorites import favorite

class Post(db.Model):
    __tablename__ = 'posts'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    body = db.Column(db.String(1300), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    category = db.Column(db.String(50), nullable=False)
    root_post_id = db.Column(db.Integer)
    parent_id = db.Column(db.Integer)
    anonymous = db.Column(db.Boolean(), default=False)
    created_at = db.Column(db.DateTime(), default=datetime.now)

    user = db.relationship('User', back_populates='user_posts')
    post_comments = db.relationship('Comment', back_populates='post', cascade="all, delete")
    post_loves = db.relationship("User", secondary=love, back_populates='user_loves', cascade="all, delete" )
    post_favorites = db.relationship("User", secondary=favorite, back_populates='user_favorites', cascade='all, delete')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "user_id": self.user_id,
            "category": self.category,
            "root_post_id": self.root_post_id,
            "parent_id": self.parent_id,
            "anonymous": self.anonymous,
            "created_at": self.created_at,
            "user": self.user.to_dict(),
            # "comments": [post_comments],
            "loves": [user.id for user in self.post_loves],
            "favorites": [user.id for user in self.post_favorites]
            # "loves": []
        }
