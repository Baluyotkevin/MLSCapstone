from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from ..forms import PostForm, PostOnPostForm, CommentForm
from ..models import db, Comment, Post, User, love

post_routes = Blueprint('posts', __name__, url_prefix='')


@post_routes.route('/')
def posts():
    """
    Query for all posts
    """
    posts = Post.query.all()
    return [post.to_dict() for post in posts]

@post_routes.route('/current')
@login_required
def user_all_posts():
    """
    Query for all of current users posts
    """
    all_posts = Post.query.filter(Post.user_id == current_user.id).all()
    new_all_posts = [post.to_dict() for post in all_posts]
    return new_all_posts

@post_routes.route('/<int:id>')
# @login_required
def user_post(id):
    """Gets One post by its id"""
    root = Post.query.get(id)
    if not root: 
        return { "message": "post does not exist"}
    childrenObj = Post.query.filter(Post.root_post_id == id).all()
    children = [child.to_dict() for child in childrenObj]
    return { "root": root.to_dict(), "children": children }


@post_routes.route('/post', methods=['POST'])
@login_required
def create_post():
    form = PostForm()
    form["csrf_token"].data=request.cookies["csrf_token"]

    if form.validate_on_submit():
        new_post=Post(
            title = form.data['title'],
            body = form.data['body'],
            user_id = current_user.id,
            category = form.data['category'],
            anonymous = form.data['anonymous']
        )
        db.session.add(new_post)
        db.session.commit()
        return new_post.to_dict()


@post_routes.route('/<int:id>/post', methods=['POST'])
@login_required
def create_post_on_post(id):
    """
    Posts on a post
    """
    post = Post.query.get(id)

    if post.user_id == current_user.id:
        child_post = Post.query.filter(Post.parent_id == id).all()
        if len(child_post):
            return {"message": "Already created a post on this"}

        if not post:
            return {"message": "Post does not exist"}
        
        form = PostOnPostForm()
        form["csrf_token"].data=request.cookies["csrf_token"]
        if form.validate_on_submit():
            if post.root_post_id is None:
                new_post=Post(
                    title = form.data['title'],
                    body = form.data['body'],
                    user_id = current_user.id,
                    category = post.category,
                    root_post_id = id,
                    parent_id = id,
                    anonymous= post.anonymous
                )
                db.session.add(new_post)
                db.session.commit()
                return new_post.to_dict()
            else:
                new_post = Post (
                    title = form.data['title'],
                    body = form.data['body'],
                    user_id = current_user.id,
                    category = post.category,
                    root_post_id = post.root_post_id,
                    parent_id = id,
                    anonymous= post.anonymous
                )
                db.session.add(new_post)
                db.session.commit()
                return new_post.to_dict()    
    return {"message": "You cannot post on this post as it does not belong to you"}

@post_routes.route('/<int:id>/comment', methods=['POST'])
@login_required
def create_comment(id):
    """Creates a comment on a post"""
    print("am i getting in here ========")
    form = CommentForm()
    form["csrf_token"].data=request.cookies["csrf_token"]

    if form.validate_on_submit():
        new_comment=Comment(
            body = form.data['body'],
            user_id = current_user.id,
            post_id = id
        )
        db.session.add(new_comment)
        db.session.commit()
        return new_comment.to_dict()
    

@post_routes.route('/<int:id>/edit', methods=['PUT'])
@login_required
def edit_post(id):
    """Edits a current users post"""
    postObj = Post.query.get(id)
    # post = postObj.to_dict()
    form = PostForm()
    form["csrf_token"].data=request.cookies["csrf_token"]
    if postObj.user_id == current_user.id:
        # if postObj.root_post_id is None:
        #     postObj.title = form.data['title']
        #     postObj.body = form.data['body']
        #     postObj.anonymous = form.data['anonymous']
        #     postObj.category = postObj.category

        #     db.session.commit()
        #     return postObj.to_dict()

        postObj.title = form.data['title']
        postObj.body = form.data['body']
        postObj.anonymous = form.data['anonymous']

        db.session.commit()
        return postObj.to_dict()
    return {"message": "You cannot edit this post as it does not belong to you"}

@post_routes.route('/<int:id>/add', methods=['POST'])
@login_required
def add_post_loves(id):
    user = User.query.get(current_user.id)
    post = Post.query.get(id)
    childrenObj = Post.query.filter(Post.root_post_id == id).all()
    children = [child.to_dict() for child in childrenObj]
    if user not in post.post_loves:
            user.user_loves.append(post)
            db.session.add(user)
            db.session.commit()
            # return post.to_dict()
            return { "root": post.to_dict(), "children": children }
    return {"message": "You already loved this post"}


@post_routes.route('/<int:id>/remove', methods=['DELETE'])
@login_required
def remove_post_loves(id):
    user = User.query.get(current_user.id)
    post = Post.query.get(id)
    childrenObj = Post.query.filter(Post.root_post_id == id).all()
    children = [child.to_dict() for child in childrenObj]
    if user in post.post_loves:
        post.post_loves.remove(user)
        print(post.post_loves)
    # db.session.delete(love)
        db.session.commit()
        return { "root": post.to_dict(), "children": children }
    return {"message": "You already unloved this post"}


@post_routes.route('/<int:id>/delete', methods=['DELETE'])
@login_required
def delete_post(id):
    """Deletes a current users post"""
    postObj = Post.query.get(id)

    if not postObj:
        return {"message": "This post does not exist"}
    
    if postObj.user_id == current_user.id:
        if postObj.root_post_id is None:
            allPost = Post.query.filter(Post.root_post_id == postObj.id).all()
            print('this is all of my post post', allPost)
            for post in allPost:
                db.session.delete(post)
            db.session.delete(postObj)
            db.session.commit()
            return {"message": "Post successfully deleted", "id": id}

        db.session.delete(postObj)
        db.session.commit()
        return {"message": "Post successfully deleted", "id": id}
    
    return {"message": "You cannot delete this post as it does not belong to you"}