from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.orm import relationship
from .likes import likes_table

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    profile_photo_url = db.Column(db.String(200))
    blog_title = db.Column(db.String(50))
    description = db.Column(db.String(255))
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    posts = relationship("Post", back_populates="owner")
    comments = relationship("Comment", back_populates='user')
    post_like = relationship('Post', secondary=likes_table, back_populates='user_like')


    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_photo_url': self.profile_photo_url,
            'blog_title': self.blog_title,
            'description': self.description,
            'posts': len(self.posts),
            'likes': len(self.post_like)
        }
