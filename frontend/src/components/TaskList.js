import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/outline';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { getTasks, deleteTask, updateTask } from '../services/api';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching tasks...');
      console.log('Token present:', !!localStorage.getItem('token'));
      
      const data = await getTasks();
      console.log('✅ Tasks received:', data);
      
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error('❌ Unexpected data format:', data);
        setTasks([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch tasks - Full error:', error);
      
      // Check if it's an axios error with response
      if (error.response) {
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        console.error('Error headers:', error.response.headers);
        
        if (error.response.status === 401) {
          toast.error('Session expired. Please login again.');
          // Clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        } else {
          toast.error(`Failed to fetch tasks: ${error.response.data?.msg || error.response.statusText}`);
        }
      } else if (error.request) {
        // The request was made but no response received
        console.error('No response received:', error.request);
        toast.error('Cannot connect to server. Is backend running on port 5000?');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        toast.error('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t.id === id);
      await updateTask(id, { ...task, status: newStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      toast.success('Task updated');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Failed to update task');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    toast.success('Logged out successfully');
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'bg-gray-100 text-gray-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-green-100 text-green-800',
      4: 'bg-yellow-100 text-yellow-800',
      5: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors[1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {showForm ? 'Cancel' : 'New Task'}
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm
            onTaskCreated={(newTask) => {
              setTasks([newTask, ...tasks]);
              setShowForm(false);
              toast.success('Task created successfully!');
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tasks.length === 0 ? (
            <li className="p-6 text-center text-gray-500">
              No tasks yet. Create your first task!
            </li>
          ) : (
            tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                getPriorityColor={getPriorityColor}
              />
            ))
          )}
        </ul>
      </div>

      {/* Removed Sparkles and AI message for a cleaner interface */}
    </div>
  );
}

export default TaskList;