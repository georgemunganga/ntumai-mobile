// @ts-nocheck
import { create } from 'zustand';
import { DeliveryAddress } from '@/types';
import { mockTaskService } from '@/src/api/mockServices';
import { createPersistentStore } from '@/src/store/utils/persistentStore';

interface Task {
  id: string;
  customerId: string;
  title: string;
  description: string;
  category: string;
  items: string[];
  budget: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  location: DeliveryAddress;
  createdAt: string;
  completedAt?: string;
  totalSpent?: number;
  rating?: number;
  review?: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  availableTasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskStore extends TaskState {
  // Task actions
  createTask: (taskData: any) => Promise<Task | null>;
  getTasks: (userId: string, role?: 'customer' | 'tasker') => Promise<void>;
  getTaskDetail: (taskId: string) => Promise<void>;
  updateTaskStatus: (taskId: string, status: string) => Promise<void>;
  rateTask: (taskId: string, rating: number, review?: string) => Promise<void>;
  cancelTask: (taskId: string) => Promise<void>;

  // Available tasks for taskers
  getAvailableTasks: () => void;

  // State management
  setCurrentTask: (task: Task | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  availableTasks: [],
  isLoading: false,
  error: null,
};

export const useTaskStore = create<TaskStore>()(
  createPersistentStore(
    (set, get) => ({
      ...initialState,

      createTask: async (taskData: any) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockTaskService.createTask(taskData);
          if (response.success) {
            set(state => ({
              tasks: [response.data, ...state.tasks],
              currentTask: response.data,
              isLoading: false,
            }));
            return response.data;
          } else {
            set({ error: response.error, isLoading: false });
            return null;
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          return null;
        }
      },

      getTasks: async (userId: string, role: 'customer' | 'tasker' = 'customer') => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockTaskService.getTasks(userId, role);
          if (response.success) {
            set({ tasks: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      getTaskDetail: async (taskId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockTaskService.getTaskDetail(taskId);
          if (response.success) {
            set({ currentTask: response.data, isLoading: false });
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateTaskStatus: async (taskId: string, status: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockTaskService.updateTaskStatus(taskId, status);
          if (response.success) {
            set(state => ({
              tasks: state.tasks.map(t => (t.id === taskId ? response.data : t)),
              currentTask: state.currentTask?.id === taskId ? response.data : state.currentTask,
              isLoading: false,
            }));
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      rateTask: async (taskId: string, rating: number, review?: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await mockTaskService.rateTask(taskId, rating, review);
          if (response.success) {
            set(state => ({
              tasks: state.tasks.map(t => (t.id === taskId ? response.data : t)),
              currentTask: state.currentTask?.id === taskId ? response.data : state.currentTask,
              isLoading: false,
            }));
          } else {
            set({ error: response.error, isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      cancelTask: async (taskId: string) => {
        try {
          set({ isLoading: true, error: null });
          const task = get().tasks.find(t => t.id === taskId);
          if (task && ['pending', 'in_progress'].includes(task.status)) {
            set(state => ({
              tasks: state.tasks.map(t =>
                t.id === taskId ? { ...t, status: 'cancelled' } : t
              ),
              isLoading: false,
            }));
          } else {
            set({ error: 'Cannot cancel this task', isLoading: false });
          }
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      getAvailableTasks: () => {
        const allTasks = get().tasks;
        const available = allTasks.filter(t => t.status === 'pending' && !t.assignedTo);
        set({ availableTasks: available });
      },

      setCurrentTask: (task: Task | null) => {
        set({ currentTask: task });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error, isLoading: false });
      },

      clearError: () => {
        set({ error: null });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'task-store',
      partialize: (state) => ({
        tasks: state.tasks,
        currentTask: state.currentTask,
      }),
    }
  )
);
