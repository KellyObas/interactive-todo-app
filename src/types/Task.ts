export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number; // 1-5 scale
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  category: string;
}

export type SortOption = 'title' | 'priority' | 'createdAt' | 'dueDate' | 'category';
export type FilterOption = 'all' | 'completed' | 'pending' | 'high-priority';