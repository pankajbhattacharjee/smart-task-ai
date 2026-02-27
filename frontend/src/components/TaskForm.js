import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { SparklesIcon } from '@heroicons/react/24/outline';

function TaskForm({ onTaskCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 3,
    deadline: ''
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnalyze = async () => {
    if (!formData.title) {
      toast.error('Please enter a title first');
      return;
    }

    setAnalyzing(true);
    try {
      // Mock AI response
      setTimeout(() => {
        const suggestions = {
          suggested_priority: Math.floor(Math.random() * 5) + 1,
          suggested_deadline: new Date(Date.now() + 3*86400000).toISOString()
        };
        
        setAiSuggestions(suggestions);
        setFormData(prev => ({
          ...prev,
          priority: suggestions.suggested_priority,
          deadline: suggestions.suggested_deadline.split('T')[0]
        }));
        
        setAnalyzing(false);
        toast.success('AI analysis complete!');
      }, 1500);
    } catch (error) {
      toast.error('AI analysis failed');
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Title is required');
      return;
    }

    const newTask = {
      id: Date.now(),
      ...formData,
      status: 'pending',
      ai_priority_score: aiSuggestions?.suggested_priority,
      ai_suggested_deadline: aiSuggestions?.suggested_deadline
    };
    
    toast.success('Task created successfully!');
    onTaskCreated(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority (1-5)
            </label>
            <input
              type="number"
              name="priority"
              min="1"
              max="5"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {aiSuggestions && (
          <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
            <div className="flex items-center text-purple-700 mb-2">
              <SparklesIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">AI Suggestions Applied</span>
            </div>
            <p className="text-sm text-purple-600">
              Priority: {aiSuggestions.suggested_priority}/5
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <SparklesIcon className="h-5 w-5 mr-2" />
            {analyzing ? 'Analyzing...' : 'AI Analyze'}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
