import React, { useState } from 'react';

const TaskCard = ({ task, onStatusUpdate, onDelete, nextStatus, previousStatus }) => {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    await onStatusUpdate(task.id, newStatus, task.status);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      await onDelete(task.id, task.status);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'To Do':
        return <img src="/assets/note.png" height={25} width={25}/>;
      case 'In Progress':
        return <img src="/assets/progress.png" height={25} width={25}/>;
      case 'Done':
        return <img src="/assets/done.png" height={25} width={25}/>;
      default:
        return <img src="/assets/task.png" height={25} width={25}/>;
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon(task.status)}</span>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            #{task.id}
          </span>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 disabled:opacity-50 text-sm"
          title="Delete task"
        >
          <img src="/assets/delete.png" alt="" height={20} width={20}/>
        </button>
      </div>

      {/* Task Title */}
      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Task Date */}
      <p className="text-xs text-gray-500 mb-3">
        Created: {formatDate(task.created_at)}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        {nextStatus && (
          <button
            onClick={() => handleStatusChange(nextStatus)}
            disabled={loading}
            className="w-full px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                Moving...
              </div>
            ) : (
              `Move to ${nextStatus}`
            )}
          </button>
        )}
</div>

 
   {previousStatus && (
    <button
    onClick={() => handleStatusChange(previousStatus)}  
    disabled={loading}
    className="w-full my-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
    {loading ? (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
      <div>Moving...</div>
      </div>
      
    ):(
      `Move to ${previousStatus}`
    )
    }
    </button>
   )}
   </div>
    )}
    export default TaskCard;