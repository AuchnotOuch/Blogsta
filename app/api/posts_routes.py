from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Post, User, PostImage
from app.forms import NewPostForm, EditPostForm
from app.aws import upload_file_to_s3, allowed_file, get_unique_filename

posts_routes = Blueprint('posts', __name__)

def validation_errors_to_error_messages(validation_errors):
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

@posts_routes.route('/')
def all_posts():
    """
    Query for all posts in database and
    return them in a list of post dictionaries
    """
    posts = Post.query.all()

    return {'Posts': [post.to_dict() for post in posts]}

@posts_routes.route('/new', methods=['POST'])
@login_required
def add_post():
    """
    Creates a new post based on submitted form data
    """
    user = current_user

    if request.form and request.form['type'] == 'photo':
        if "image" not in request.files:
            return {'error': "Must provide image"}, 400

        image = request.files['image']

        if not allowed_file(image.filename):
            return {'error': 'filetype not permitted'}, 400

        image.filename = get_unique_filename(image.filename)

        upload = upload_file_to_s3(image)

        if "url" not in upload:
            return upload, 400

        url = upload["url"]

        photo_post = Post(
            owner_id = user.id,
            type = 'photo',
            content = request.form['content']
        )
        db.session.add(photo_post)
        db.session.commit()

        post_photo = PostImage(
            post_id = photo_post.id,
            url = url,
            text = request.form['image_caption']
        )

        db.session.add(post_photo)
        db.session.commit()

        return photo_post.to_dict()

    form = NewPostForm()


    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        new_post = Post(
            owner_id = user.id,
            type = form.data['type'],
            title = form.data['title'],
            content = form.data['content'],
            quote_source = form.data['quote_source'],
            link_url = form.data['link_url']
        )

        db.session.add(new_post)
        db.session.commit()

        if form.data['image_url']:
            newImage = PostImage(
                    post_id = new_post.id,
                    url = form.data['image_url'],
                    text = form.data['image_caption']
                )

            db.session.add(newImage)
            db.session.commit()
        return new_post.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401

@posts_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_post(id):
    """
    Updates a post with updated form data
    """
    form = EditPostForm()
    user = current_user
    post = Post.query.get(id)

    form['csrf_token'].data = request.cookies['csrf_token']
    if post is not None:
        if form.validate_on_submit():
            if form.data['title']:
                post.title = form.data['title']
            if not form.data['title']:
                post.title = ''
            if form.data['content']:
                post.content = form.data['content']
            if not form.data['content']:
                post.content = ''
            if form.data['quote_source']:
                post.quote_source = form.data['quote_source']
            if not form.data['quote_source']:
                post.quote_source = ''
            db.session.commit()
            return post.to_dict()

        return {'errors': validation_errors_to_error_messages(form.errors)}, 401
    return {"Error": f'Post {id} not found'}


@posts_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_post(id):

    post = Post.query.get(id)

    if post is not None:
        db.session.delete(post)
        db.session.commit()
        return {'Message': f'Post {id} successfully deleted'}

    return {"Error": f'Post {id} not found'}, 404
