from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Allow CORS for frontend
    CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
    
    db.init_app(app)
    jwt.init_app(app)
    
    from app.routes import tasks, auth
    app.register_blueprint(tasks.bp)
    app.register_blueprint(auth.bp)
    
    with app.app_context():
        db.create_all()
    
    return app