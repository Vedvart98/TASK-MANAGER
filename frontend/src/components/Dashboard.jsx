import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../utils/api';
import TaskForm from './TaskForm';
import TaskCard from './TaskCard';

const Dashboard = () => {
  const [tasks, setTasks] = useState({
    'To Do': [],
    'In Progress': [],
    'Done': []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalTasks, setTotalTasks] = useState(0);

  const { user, logout } = useAuth();

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks();
      setTasks(response.data.tasks);
      setTotalTasks(response.data.totalTasks);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreate = async (title) => {
    try {
      const response = await taskAPI.createTask(title);
      const newTask = response.data.task;
      
      setTasks(prev => ({
        ...prev,
        'To Do': [newTask, ...prev['To Do']]
      }));
      setTotalTasks(prev => prev + 1);
      
      return { success: true };
    } catch (error) {
      console.error('Error creating task:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create task' 
      };
    }
  };

  const handleStatusUpdate = async (taskId, newStatus, oldStatus) => {
    try {
      await taskAPI.updateTaskStatus(taskId, newStatus);  
      
      // Update local state
      setTasks(prev => {
        const taskToMove = prev[oldStatus].find(task => task.id === taskId);
        if (!taskToMove) return prev;
        
        return {
          ...prev,
          [oldStatus]: prev[oldStatus].filter(task => task.id !== taskId),
          [newStatus]: [...prev[newStatus], { ...taskToMove, status: newStatus }]
        };
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task status');
    }
  };

  const handleTaskDelete = async (taskId, currentStatus) => {
    try {
      await taskAPI.deleteTask(taskId);
      
      setTasks(prev => ({
        ...prev,
        [currentStatus]: prev[currentStatus].filter(task => task.id !== taskId)
      }));
      setTotalTasks(prev => prev - 1);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Done':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'To Do':
        return 'In Progress';
      case 'In Progress':
        return 'Done';
      default:
        return null;
    }
  };

  const getPreviousStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'In Progress':
        return 'To Do';
      case 'Done':
        return 'In Progress';
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Total Tasks: <span className="font-semibold">{totalTasks}</span>
              </div>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task Creation Form */}
        <div className="mb-8">
          <TaskForm onTaskCreate={handleTaskCreate} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              
            </button>
          </div>
        )}

        {/* Task Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([status, taskList]) => (
            <div key={status} className="bg-white rounded-lg shadow-sm border">
              <div className={`px-4 py-3 border-b ${getStatusColor(status)} rounded-t-lg`}>
                <h2 className="font-semibold text-lg flex items-center justify-between">
                  {status}
                  <span className="text-sm font-normal">
                    ({taskList.length})
                  </span>
                </h2>
              </div>
              
              <div className="p-4 space-y-3 min-h-[400px]">
                {taskList.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p className="text-sm">No tasks in {status.toLowerCase()}</p>
                  </div>
                ) : (
                  taskList.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusUpdate={handleStatusUpdate}
                      onDelete={handleTaskDelete}
                      nextStatus={getNextStatus(task.status)}
                      previousStatus={getPreviousStatus(task.status)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{tasks['To Do'].length}</div>
              <div className="text-sm text-gray-600">To Do</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{tasks['In Progress'].length}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{tasks['Done'].length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;