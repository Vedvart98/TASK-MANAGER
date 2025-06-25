import React, { useState } from 'react';

const TaskForm = ({ onTaskCreate }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onTaskCreate(title.trim());
    
    if (result.success) {
      setTitle('');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setTitle(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="taskTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <div className="flex space-x-2">
            <input
              id="taskTitle"
              type="text"
              value={title}
              onChange={handleInputChange}
              placeholder="Enter task title..."
              disabled={loading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={255}
            />
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : (
                'Add Task'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}
      </form>

      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Tip: New tasks will start in the "To Do" column. You can move them through In Progress to Done.</p>
      </div>
    </div>
  );
};

export default TaskForm;