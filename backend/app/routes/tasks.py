from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Task, User
from app.services.gemini_service import GeminiService
from datetime import datetime, timedelta

bp = Blueprint('tasks', __name__, url_prefix='/api/tasks')

# Initialize Gemini service (will use mock data if no API key)
ai_service = GeminiService()

@bp.route('', methods=['GET'])
@jwt_required()
def get_tasks():
    from flask import request
    print('Authorization header:', request.headers.get('Authorization'))
    user_id = get_jwt_identity()
    tasks = Task.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': t.id,
        'title': t.title,
        'description': t.description,
        'priority': t.priority,
        'status': t.status,
        'deadline': t.deadline.isoformat() if t.deadline else None,
        'ai_suggested_deadline': t.ai_suggested_deadline.isoformat() if t.ai_suggested_deadline else None,
        'ai_priority_score': t.ai_priority_score,
        'created_at': t.created_at.isoformat()
    } for t in tasks]), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_task():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Get AI suggestions from Gemini
    ai_priority = ai_service.analyze_task_priority(data['title'], data.get('description', ''))
    ai_deadline = ai_service.suggest_deadline(
        data['title'], 
        data.get('description', ''),
        data.get('priority', ai_priority)
    )
    
    task = Task(
        title=data['title'],
        description=data.get('description'),
        priority=data.get('priority', ai_priority),
        deadline=datetime.fromisoformat(data['deadline']) if data.get('deadline') else None,
        ai_suggested_deadline=ai_deadline,
        ai_priority_score=ai_priority,
        user_id=user_id
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify({'message': 'Task created', 'id': task.id}), 201

@bp.route('/<int:task_id>', methods=['PUT'])
@jwt_required()
def update_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    data = request.get_json()
    
    task.title = data.get('title', task.title)
    task.description = data.get('description', task.description)
    task.priority = data.get('priority', task.priority)
    task.status = data.get('status', task.status)
    if data.get('deadline'):
        task.deadline = datetime.fromisoformat(data['deadline'])
    
    db.session.commit()
    return jsonify({'message': 'Task updated'}), 200

@bp.route('/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Task deleted'}), 200

@bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze_task():
    data = request.get_json()
    priority = ai_service.analyze_task_priority(data['title'], data.get('description', ''))
    deadline = ai_service.suggest_deadline(data['title'], data.get('description', ''), priority)
    
    return jsonify({
        'suggested_priority': priority,
        'suggested_deadline': deadline.isoformat()
    }), 200

