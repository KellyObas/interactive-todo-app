import React, { useState } from 'react';
import { Task } from '../types/Task';
import { 
  Edit2, 
  Trash2, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityInfo = (priority: number) => {
    switch (priority) {
      case 1: return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Low' };
      case 2: return { color: 'text-green-600', bg: 'bg-green-100', label: 'Normal' };
      case 3: return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium' };
      case 4: return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High' };
      case 5: return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', label: 'Unknown' };
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Work: 'bg-purple-100 text-purple-800',
      Personal: 'bg-indigo-100 text-indigo-800',
      Health: 'bg-emerald-100 text-emerald-800',
      Learning: 'bg-amber-100 text-amber-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
  const isDueToday = task.dueDate && 
    task.dueDate.toDateString() === new Date().toDateString() && !task.completed;

  const priorityInfo = getPriorityInfo(task.priority);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ${
        task.completed ? 'opacity-75' : ''
      } ${isOverdue ? 'border-red-200 bg-red-50' : ''} ${
        isDueToday ? 'border-amber-200 bg-amber-50' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 transition-colors duration-200 ${
            task.completed ? 'text-green-600' : 'text-gray-400 hover:text-green-500'
          }`}
        >
          {task.completed ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`font-medium text-gray-900 ${
                  task.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`mt-1 text-sm text-gray-600 ${
                    task.completed ? 'line-through' : ''
                  }`}
                >
                  {task.description}
                </p>
              )}
            </div>

            <div className={`flex items-center space-x-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors duration-200"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 mt-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.color}`}>
              <AlertCircle className="w-3 h-3 mr-1" />
              Priority {task.priority}
            </span>

            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
              <Tag className="w-3 h-3 mr-1" />
              {task.category}
            </span>

            {task.dueDate && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                isOverdue
                  ? 'bg-red-100 text-red-800'
                  : isDueToday
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 mr-1" />
                ) : (
                  <Calendar className="w-3 h-3 mr-1" />
                )}
                {task.dueDate.toLocaleDateString()}
              </span>
            )}

            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <Clock className="w-3 h-3 mr-1" />
              {task.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};