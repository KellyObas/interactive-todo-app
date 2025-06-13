import React, { useState, useEffect, useMemo } from 'react';
import { Task, SortOption, FilterOption } from './types/Task';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { TaskFilters } from './components/TaskFilters';
import { ProgressBar } from './components/ProgressBar';
import { loadTasks, saveTasks, exportTasks } from './utils/storage';
import { CheckSquare, Sparkles } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Load tasks on component mount
  useEffect(() => {
    const savedTasks = loadTasks();
    setTasks(savedTasks);
  }, []);

  // Save tasks whenever tasks array changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;
    
    const updatedTask: Task = {
      ...editingTask,
      ...taskData,
      updatedAt: new Date(),
    };
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    setEditingTask(undefined);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(undefined);
  };

  const handleExport = () => {
    exportTasks(tasks);
  };

  // Filtered and sorted tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (filterBy) {
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      case 'pending':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'high-priority':
        filtered = filtered.filter(task => task.priority >= 4);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          return b.priority - a.priority; // Higher priority first
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        case 'createdAt':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime(); // Newest first
      }
    });

    return filtered;
  }, [tasks, searchTerm, sortBy, filterBy]);

  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskMaster Pro
            </h1>
            <Sparkles className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Organize your life with intelligent task management, priority scoring, and seamless productivity tracking.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Form */}
            <TaskForm
              onSubmit={editingTask ? handleEditTask : handleAddTask}
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />

            {/* Filters */}
            <TaskFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filterBy={filterBy}
              onFilterChange={setFilterBy}
              onExport={handleExport}
              taskCount={tasks.length}
              completedCount={completedTasks}
            />

            {/* Task List */}
            <div className="space-y-4">
              {filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <CheckSquare className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
                  </h3>
                  <p className="text-gray-500">
                    {tasks.length === 0 
                      ? 'Create your first task to get started with your productivity journey!'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                </div>
              ) : (
                filteredAndSortedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteTask}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProgressBar completed={completedTasks} total={tasks.length} />

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tasks</span>
                  <span className="font-semibold text-gray-900">{tasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">{tasks.length - completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Priority</span>
                  <span className="font-semibold text-red-600">
                    {tasks.filter(task => task.priority >= 4 && !task.completed).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {tasks.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {tasks
                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                    .slice(0, 5)
                    .map(task => (
                      <div key={task.id} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.completed ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.updatedAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            Built with ❤️ by <span className="font-semibold text-indigo-600">KellyObas</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;