import React from 'react';

function TaskItem({ task, onDelete, onStatusChange, getPriorityColor }) {
  return (
    <li className="task-item">
      <div className="task-header">
        <span className="task-title">{task.title}</span>
        <span className={getPriorityColor(task.priority)}>
          P{task.priority}
        </span>
        {task.ai_priority_score && (
          <span className="ai-badge">
            AI: {task.ai_priority_score}
          </span>
        )}
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <span>📅 {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}</span>
        
        {task.ai_suggested_deadline && (
          <span>✨ AI: {new Date(task.ai_suggested_deadline).toLocaleDateString()}</span>
        )}
        
        <select 
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="status-select"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <button 
          onClick={() => onDelete(task.id)}
          className="delete-btn"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default TaskItem;