import React, { useState, useEffect } from 'react';
import { Task } from '../types/Task';
import { Plus, X, Calendar, Tag, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTask?: Task;
  onCancel?: () => void;
}

const categories = ['Work', 'Personal', 'Health', 'Learning', 'Shopping', 'Other'];

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, editingTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Personal');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setPriority(editingTask.priority);
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate ? editingTask.dueDate.toISOString().split('T')[0] : '');
      setIsOpen(true);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: editingTask?.completed || false,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      category,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(1);
    setDueDate('');
    setCategory('Personal');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority(1);
    setDueDate('');
    setCategory('Personal');
    setIsOpen(false);
    onCancel?.();
  };

  const getPriorityColor = (p: number) => {
    switch (p) {
      case 1: return 'text-blue-600';
      case 2: return 'text-green-600';
      case 3: return 'text-yellow-600';
      case 4: return 'text-orange-600';
      case 5: return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen && !editingTask) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add New Task</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Level
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                <option value={1}>1 - Low</option>
                <option value={2}>2 - Normal</option>
                <option value={3}>3 - Medium</option>
                <option value={4}>4 - High</option>
                <option value={5}>5 - Critical</option>
              </select>
              <AlertCircle className={`absolute right-3 top-2.5 w-4 h-4 ${getPriorityColor(priority)} pointer-events-none`} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Tag className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
              <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mt-6">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
        >
          {editingTask ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};