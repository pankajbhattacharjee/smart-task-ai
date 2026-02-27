from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models import User
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password'])
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Convert user.id to string
    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'user_id': user.id}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        # Convert user.id to string
        token = create_access_token(identity=str(user.id))
        return jsonify({'token': token, 'user_id': user.id}), 200
    
    return jsonify({'error': 'Invalid credentials'}), 401