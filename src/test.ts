
// const TaskDashboard: React.FC = () => {
//     const [displayTodoForm, setDisplayTodoForm] = useState<boolean>(false);
//     const { state: { error, loading, tasks }, updateTask, deleteTask } = useTaskContext();
//     const { username } = useAuthContext();
//     const [editTaskId, setEditTaskId] = useState<string | null>(null);
//     const [editContent, setEditContent] = useState('');
//     const [editCompleted, setEditCompleted] = useState(false);
//     const [clientError, setClientError] = useState('');
//     const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>('all');

//     const filteredTasks = tasks.filter((task) => {
//         if (filter === 'all') return true;
//         if (filter === 'completed') return task.completed;
//         return !task.completed;
//     });

//     const handleEdit = (task: { _id: string; content: string; completed: boolean }) => {
//         setEditTaskId(task._id);
//         setEditContent(task.content);
//         setEditCompleted(task.completed);
//     };

//     const handleEditSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!editContent.trim()) {
//             setClientError('Task content cannot be empty');
//             return;
//         }
//         try {
//             await updateTask(editTaskId!, editContent, editCompleted);
//             setEditTaskId(null);
//             setEditContent('');
//             setEditCompleted(false);
//             setClientError('');
//         } catch (error: any) {
//             setClientError(error.message || 'Failed to update task');
//             console.error(error);
//         }
//     };

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteTask(id);
//         } catch (error: any) {
//             setClientError(error.message || 'Failed to delete task');
//             console.error(error);
//         }
//     };

//     return (
//         <>
//             <p className="text-red-900 uppercase text-center mt-10 font-bold text-[30px]">
//                 Task Manager, {username || 'User'}
//             </p>
//             {loading && <p className="text-center">Loading...</p>}
//             {error && <p className="text-red-900 text-center">{error}</p>}
//             {clientError && <p className="text-red-900 text-center">{clientError}</p>}
//             <div className="sm:w-[50%] mx-5 sm:mx-0 md:m-auto mt-5 flex justify-between">
//                 <button
//                     className="text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
//                     onClick={() => setDisplayTodoForm(!displayTodoForm)}
//                 >
//                     {displayTodoForm ? 'Close Form' : 'Add Task'}
//                 </button>
//                 <select
//                     name="filter"
//                     id="filter"
//                     className="border text-white bg-red-900 px-5 py-2 rounded"
//                     value={filter}
//                     onChange={(e) => setFilter(e.target.value as 'all' | 'incomplete' | 'completed')}
//                 >
//                     <option value="all">All</option>
//                     <option value="incomplete">Incomplete</option>
//                     <option value="completed">Completed</option>
//                 </select>
//             </div>
//             {displayTodoForm && (
//                 <AddTodoForm
//                     displayTodoForm={displayTodoForm}
//                     setDisplayTodoForm={setDisplayTodoForm}
//                 />
//             )}
//             <div className="sm:w-[50%] mx-5 sm:mx-0 md:m-auto mt-5 border">
//                 <ul>
//                     {filteredTasks.length === 0 && !loading && (
//                         <p className="text-center">No tasks found.</p>
//                     )}
//                     {filteredTasks.map((task) => (
//                         <div key={task._id} className="flex justify-between items-center p-2 border-b">
//                             {editTaskId === task._id ? (
//                                 <form onSubmit={handleEditSubmit} className="flex w-full gap-x-3">
//                                     <input
//                                         type="text"
//                                         value={editContent}
//                                         onChange={(e) => setEditContent(e.target.value)}
//                                         className="border bg-white w-[60%] rounded outline-none py-1 px-2"
//                                     />
//                                     <label>
//                                         <input
//                                             type="checkbox"
//                                             checked={editCompleted}
//                                             onChange={(e) => setEditCompleted(e.target.checked)}
//                                         />
//                                         Completed
//                                     </label>
//                                     <button
//                                         type="submit"
//                                         className="text-white bg-red-900 px-3 py-1 rounded"
//                                     >
//                                         Save
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className="text-white bg-red-900 px-3 py-1 rounded"
//                                         onClick={() => setEditTaskId(null)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </form>
//                             ) : (
//                                 <li className="flex gap-x-3 items-center">
//                                     <input
//                                         type="checkbox"
//                                         checked={task.completed}
//                                         onChange={() => updateTask(task._id, task.content, !task.completed)}
//                                     />
//                                     <p>{task.content}</p>
//                                     <div className="flex gap-x-3">
//                                         <button
//                                             type="button"
//                                             className="text-red-900"
//                                             onClick={() => handleEdit(task)}
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             type="button"
//                                             className="text-red-900"
//                                             onClick={() => handleDelete(task._id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </li>
//                             )}
//                         </div>
//                     ))}
//                 </ul>
//             </div>
//         </>
//     );
// };

















// import React, { useEffect, useState } from 'react';
// import { useTaskContext } from '../contexts/TaskContext';
// import { useAuthContext } from '../hooks/authContextHook';
// import AddTodoForm from './AddTodoForm';

// const TaskManagerDashboard: React.FC = () => {
//     const { state: { tasks, loading, error }, fetchTasks, updateTask, deleteTask } = useTaskContext();
//     const { username } = useAuthContext();
//     const [displayTodoForm, setDisplayTodoForm] = useState(false);
//     const [editTaskId, setEditTaskId] = useState<string | null>(null);
//     const [formData, setFormData] = useState({ content: '' });
//     const [clientError, setClientError] = useState('');

//     useEffect(() => {
//         fetchTasks();
//     }, [fetchTasks]);

//     const validateForm = () => {
//         if (!formData.content.trim()) {
//             setClientError('Task content is required');
//             return false;
//         }
//         setClientError('');
//         return true;
//     };

//     const handleEditSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!editTaskId || !validateForm()) return;

//         try {
//             await updateTask(editTaskId, formData.content);
//             setFormData({ content: '' });
//             setEditTaskId(null);
//         } catch (err) {
//             setClientError('Failed to update task');
//             console.error(err);
//         }
//     };

//     const handleEdit = (task: { _id: string; content: string }) => {
//         setEditTaskId(task._id);
//         setFormData({ content: task.content });
//     };

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteTask(id);
//         } catch (err) {
//             setClientError('Failed to delete task');
//             console.error(err);
//         }
//     };

//     return (
//         <div className="w-[80%] m-auto mt-10">
//             <h2 className="text-red-900 capitalize text-center text-[30px]">
//                 Task Manager, {username || 'User'}
//             </h2>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-900">{error}</p>}
//             <button
//                 className="text-white bg-red-900 px-5 py-2 rounded cursor-pointer mb-5"
//                 onClick={() => setDisplayTodoForm(true)}
//             >
//                 Add New Task
//             </button>
//             {displayTodoForm && (
//                 <AddTodoForm
//                     displayTodoForm={displayTodoForm}
//                     setDisplayTodoForm={setDisplayTodoForm}
//                 />
//             )}
//             <div className="mt-10">
//                 <h3 className="text-red-900 text-[20px]">Tasks</h3>
//                 {tasks.length === 0 && !loading && <p>No tasks found.</p>}
//                 <ul className="space-y-2 mt-2">
//                     {tasks.map((task) => (
//                         <li key={task._id} className="flex justify-between items-center border p-2 rounded">
//                             {editTaskId === task._id ? (
//                                 <form onSubmit={handleEditSubmit} className="flex w-full">
//                                     <input
//                                         type="text"
//                                         value={formData.content}
//                                         onChange={(e) => setFormData({ content: e.target.value })}
//                                         className="border bg-white w-[60%] rounded outline-none py-1 placeholder:px-2"
//                                     />
//                                     <button
//                                         type="submit"
//                                         className="text-white bg-red-900 px-3 py-1 rounded ml-2"
//                                     >
//                                         Save
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className="text-white bg-red-900 px-3 py-1 rounded ml-2"
//                                         onClick={() => setEditTaskId(null)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </form>
//                             ) : (
//                                 <>
//                                     <span>{task.content}</span>
//                                     <div>
//                                         <button
//                                             className="border px-3 py-1 rounded mr-2"
//                                             onClick={() => handleEdit(task)}
//                                         >
//                                             Edit
//                                         </button>
//                                         <button
//                                             className="border px-3 py-1 rounded text-red-900"
//                                             onClick={() => handleDelete(task._id)}
//                                         >
//                                             Delete
//                                         </button>
//                                     </div>
//                                 </>
//                             )}
//                             {clientError && editTaskId === task._id && (
//                                 <p className="text-red-500">{clientError}</p>
//                             )}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default TaskManagerDashboard;
































// import React, { useEffect, useState } from 'react';
// import { useTaskContext } from '../contexts/TaskContext';
// import { useAuthContext } from '../hooks/authContextHook';

// const TaskList: React.FC = () => {
//     const { state: { tasks, loading, error }, fetchTasks, createTask, updateTask, deleteTask } = useTaskContext();
//     const { username } = useAuthContext();
//     const [formData, setFormData] = useState({ content: '' });
//     const [editTaskId, setEditTaskId] = useState<string | null>(null);
//     const [clientError, setClientError] = useState('');

//     useEffect(() => {
//         fetchTasks();
//     }, [fetchTasks]);

//     const validateForm = () => {
//         if (!formData.content.trim()) {
//             setClientError('Task content is required');
//             return false;
//         }
//         setClientError('');
//         return true;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!validateForm()) return;

//         try {
//             if (editTaskId) {
//                 await updateTask(editTaskId, formData.content);
//             } else {
//                 await createTask(formData.content);
//             }
//             setFormData({ content: '' });
//             setEditTaskId(null);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const handleEdit = (task: { _id: string; content: string }) => {
//         setEditTaskId(task._id);
//         setFormData({ content: task.content });
//     };

//     const handleDelete = async (id: string) => {
//         try {
//             await deleteTask(id);
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     return (
//         <div className="w-[80%] m-auto mt-10">
//             <h2 className="text-red-900 capitalize text-center text-[30px]">
//                 Manage Tasks, {username || 'User'}
//             </h2>
//             {loading && <p>Loading...</p>}
//             {error && <p className="text-red-900">{error}</p>}
//             <form className="flex flex-col space-y-4 mt-5" onSubmit={handleSubmit}>
//                 <div>
//                     <input
//                         type="text"
//                         value={formData.content}
//                         onChange={(e) => setFormData({ content: e.target.value })}
//                         placeholder="Task content"
//                         className="border-2 p-2 rounded-[10px] w-full"
//                     />
//                     {clientError && <p className="text-red-900">{clientError}</p>}
//                 </div>
//                 <button
//                     type="submit"
//                     className="border px-5 rounded cursor-pointer py-2"
//                     disabled={loading}
//                 >
//                     {editTaskId ? 'Update Task' : 'Create Task'}
//                 </button>
//             </form>
//             <div className="mt-10">
//                 <h3 className="text-red-900 text-[20px]">Tasks</h3>
//                 {tasks.length === 0 && !loading && <p>No tasks found.</p>}
//                 <ul className="space-y-2 mt-2">
//                     {tasks.map((task) => (
//                         <li key={task._id} className="flex justify-between items-center border p-2 rounded">
//                             <span>{task.content}</span>
//                             <div>
//                                 <button
//                                     className="border px-3 py-1 rounded mr-2"
//                                     onClick={() => handleEdit(task)}
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     className="border px-3 py-1 rounded text-red-900"
//                                     onClick={() => handleDelete(task._id)}
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default TaskList;
















// import axios from 'axios';
// import { createContext, useReducer, useCallback, useContext, type ReactNode } from 'react';

// interface Task {
//     _id: string;
//     content: string;
//     createdBy: string;
//     createdAt: string;
// }

// interface TaskState {
//     tasks: Task[];
//     loading: boolean;
//     error: string | null;
// }

// type TaskAction =
//     | { type: 'FETCH_TASKS_REQUEST' }
//     | { type: 'FETCH_TASKS_SUCCESS'; payload: Task[] }
//     | { type: 'FETCH_TASKS_FAILURE'; payload: string }
//     | { type: 'CREATE_TASK_SUCCESS'; payload: Task }
//     | { type: 'UPDATE_TASK_SUCCESS'; payload: Task }
//     | { type: 'DELETE_TASK_SUCCESS'; payload: string }
//     | { type: 'SET_ERROR'; payload: string | null };

// interface TaskContextType {
//     state: TaskState;
//     fetchTasks: () => Promise<void>;
//     createTask: (content: string) => Promise<void>;
//     updateTask: (id: string, content: string) => Promise<void>;
//     deleteTask: (id: string) => Promise<void>;
// }

// export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
//     switch (action.type) {
//         case 'FETCH_TASKS_REQUEST':
//             return { ...state, loading: true, error: null };
//         case 'FETCH_TASKS_SUCCESS':
//             return { ...state, loading: false, tasks: action.payload, error: null };
//         case 'FETCH_TASKS_FAILURE':
//             return { ...state, loading: false, error: action.payload };
//         case 'CREATE_TASK_SUCCESS':
//             return { ...state, loading: false, tasks: [...state.tasks, action.payload], error: null };
//         case 'UPDATE_TASK_SUCCESS':
//             return {
//                 ...state,
//                 loading: false,
//                 tasks: state.tasks.map((task) =>
//                     task._id === action.payload._id ? action.payload : task
//                 ),
//                 error: null,
//             };
//         case 'DELETE_TASK_SUCCESS':
//             return {
//                 ...state,
//                 loading: false,
//                 tasks: state.tasks.filter((task) => task._id !== action.payload),
//                 error: null,
//             };
//         case 'SET_ERROR':
//             return { ...state, error: action.payload, loading: false };
//         default:
//             return state;
//     }
// };

// export const TaskProvider = ({ children }: { children: ReactNode }) => {
//     const [state, dispatch] = useReducer(taskReducer, {
//         tasks: [],
//         loading: false,
//         error: null,
//     });

//     const fetchTasks = useCallback(async () => {
//         try {
//             dispatch({ type: 'FETCH_TASKS_REQUEST' });
//             const token = localStorage.getItem('regToken');
//             const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/tasks`, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: response.data.getAll });
//         } catch (error: any) {
//             const errorMessage =
//                 error.response?.status === 401
//                     ? 'Unauthorized: Please log in'
//                     : error.response?.data?.msg || error.message || 'Failed to fetch tasks';
//             dispatch({ type: 'FETCH_TASKS_FAILURE', payload: errorMessage });
//         }
//     }, []);

//     const createTask = useCallback(async (content: string) => {
//         try {
//             dispatch({ type: 'FETCH_TASKS_REQUEST' });
//             const token = localStorage.getItem('regToken');
//             const response = await axios.post(
//                 `${import.meta.env.VITE_SERVER_URL}/api/v1/tasks`,
//                 { content },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             dispatch({ type: 'CREATE_TASK_SUCCESS', payload: response.data.task });
//         } catch (error: any) {
//             const errorMessage =
//                 error.response?.status === 400
//                     ? 'Invalid task data'
//                     : error.response?.data?.msg || error.message || 'Failed to create task';
//             dispatch({ type: 'SET_ERROR', payload: errorMessage });
//             throw new Error(errorMessage);
//         }
//     }, []);

//     const updateTask = useCallback(async (id: string, content: string) => {
//         try {
//             dispatch({ type: 'FETCH_TASKS_REQUEST' });
//             const token = localStorage.getItem('regToken');
//             const response = await axios.put(
//                 `${import.meta.env.VITE_SERVER_URL}/api/v1/tasks/${id}`,
//                 { content },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             dispatch({ type: 'UPDATE_TASK_SUCCESS', payload: response.data.updateTask });
//         } catch (error: any) {
//             const errorMessage =
//                 error.response?.status === 400
//                     ? 'Task content cannot be empty'
//                     : error.response?.status === 404
//                     ? 'Task not found'
//                     : error.response?.data?.msg || error.message || 'Failed to update task';
//             dispatch({ type: 'SET_ERROR', payload: errorMessage });
//             throw new Error(errorMessage);
//         }
//     }, []);

//     const deleteTask = useCallback(async (id: string) => {
//         try {
//             dispatch({ type: 'FETCH_TASKS_REQUEST' });
//             const token = localStorage.getItem('regToken');
//             const response = await axios.delete(
//                 `${import.meta.env.VITE_SERVER_URL}/api/v1/tasks/${id}`,
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             dispatch({ type: 'DELETE_TASK_SUCCESS', payload: id });
//         } catch (error: any) {
//             const errorMessage =
//                 error.response?.status === 404
//                     ? 'Task not found'
//                     : error.response?.data?.msg || error.message || 'Failed to delete task';
//             dispatch({ type: 'SET_ERROR', payload: errorMessage });
//             throw new Error(errorMessage);
//         }
//     }, []);

//     return (
//         <TaskContext.Provider value={{ state, fetchTasks, createTask, updateTask, deleteTask }}>
//             {children}
//         </TaskContext.Provider>
//     );
// };

// export const useTaskContext = () => {
//     const context = useContext(TaskContext);
//     if (!context) {
//         throw new Error('useTaskContext must be used within a TaskProvider');
//     }
//     return context;
// };



//     // Backend API URL (from Render)
//     const API_URL = process.env.REACT_APP_API_URL || 'https://your-render-url.onrender.com';

//     // Fetch tasks
//     const fetchTasks = useCallback(async () => {
//         if (!state.user) return;
//         dispatch({ type: 'FETCH_TASKS_REQUEST' });
//         try {
//             const response = await axios.get(`${API_URL}/api/tasks`, {
//                 headers: { Authorization: `Bearer ${state.user.token}` },
//             });
//             dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: response.data });
//         } catch (error: any) {
//             dispatch({
//                 type: 'FETCH_TASKS_FAILURE',
//                 payload: error.response?.data?.error?.message || 'Failed to fetch tasks',
//             });
//         }
//     }, [state.user]);

//     // Add task
//     const addTask = useCallback(async (title: string, description?: string) => {
//         if (!state.user) return;
//         try {
//             const response = await axios.post(
//                 `${API_URL}/api/tasks`,
//                 { title, description },
//                 { headers: { Authorization: `Bearer ${state.user.token}` } }
//             );
//             dispatch({ type: 'ADD_TASK', payload: response.data });
//         } catch (error: any) {
//             throw new Error(error.response?.data?.error?.message || 'Failed to add task');
//         }
//     }, [state.user]);

//     // Delete task
//     const deleteTask = useCallback(async (id: string) => {
//         if (!state.user) return;
//         try {
//             await axios.delete(`${API_URL}/api/tasks/${id}`, {
//                 headers: { Authorization: `Bearer ${state.user.token}` },
//             });
//             dispatch({ type: 'DELETE_TASK', payload: id });
//         } catch (error: any) {
//             throw new Error(error.response?.data?.error?.message || 'Failed to delete task');
//         }
//     }, [state.user]);

//     // Login
//     const login = useCallback(async (email: string, password: string) => {
//         try {
//             const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
//             const { token, userId } = response.data;
//             dispatch({ type: 'SET_USER', payload: { token, userId } });
//             // Fetch tasks after login
//             await fetchTasks();
//         } catch (error: any) {
//             throw new Error(error.response?.data?.error?.message || 'Login failed');
//         }
//     }, [fetchTasks]);

//     // Logout
//     const logout = useCallback(() => {
//         dispatch({ type: 'SET_USER', payload: null });
//         dispatch({ type: 'FETCH_TASKS_SUCCESS', payload: [] });
//     }, []);

