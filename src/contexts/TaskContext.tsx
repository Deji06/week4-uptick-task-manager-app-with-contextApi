import axios from "axios";
import {
  useContext,
  createContext,
  type ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
// single task created data
interface TaskTypes {
  _id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  // count: number;
}

type FilterOption = "all" | "completed" | "incomplete";

interface TaskState {
  tasks: TaskTypes[];
  loading: boolean;
  error: string | null;
  updateTaskError: string | null;
  createTaskError: string | null;
  count: number;
  filterState: FilterOption;
  filteredTasks: TaskTypes[];
}

// shape of value that will be passed to component
interface TaskContextTypes {
  state: TaskState;
  fetchAllTasks: () => Promise<void>;
  createTask: (content: string) => Promise<boolean>;
  updateTask: (content: string, id: string) => Promise<boolean>;
  deleteTask: (id: string) => Promise<void>;
  setFilterState: (filter: FilterOption) => void;
  checkTaskBox: (id: string) => Promise<void>;
  resetTaskState: () => void;
}

export const TaskContext = createContext<TaskContextTypes | undefined>(
  undefined
);

//where states are being stored that will be manipulated in the components
export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskTypes[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskTypes[]>([]);
  const [filterState, setFilterState] = useState<FilterOption>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(0);
  const [createTaskError, setCreateTaskError] = useState<string | null>(null);
  const [updateTaskError, setUpdateTaskError] = useState<string | null>(null);
  //combined states structure
  const state: TaskState = {
    tasks,
    loading,
    error,
    createTaskError,
    updateTaskError,
    count,
    filteredTasks,
    filterState,
  };

  const resetTaskState = useCallback(() => {
    setTasks([]);
    setFilteredTasks([]);
    setFilterState("all");
    setLoading(false);
    setError(null);
    setCreateTaskError("");
    setCount(0);
    console.log("task related info cleared");
  }, []);

  const fetchAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please log in to view tasks");
        setLoading(false);
        return;
      }
      const URL = import.meta.env.VITE_SERVER_URL;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const findAllTasksResponse = await axios.get(
        `${URL}/api/v1/task`,
        config
      );
      console.log("getalldata:", findAllTasksResponse.data);
      setTasks(findAllTasksResponse.data?.getAll);
      setCount(findAllTasksResponse.data?.count);
      setError(null);
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage = "Failed to fetch tasks, check internet connectivity";
      } else if (error.response && error.response.status === 401) {
        errorMessage = "Unauthorized user, please login";
      } else if (error.response && error.response.data?.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to fetch task";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchAllTasks();
    } else {
      setTasks([]);
      setFilteredTasks([]);
      setCount(0);
      setError("Please log in to view tasks");
      setLoading(false);
    }
    // fetchAllTasks()
  }, []);

  const createTask = useCallback(async (content: string) => {
    setLoading(true);
    setCreateTaskError(null);
    if (content.trim() === "") {
      setCreateTaskError("content cannot be empty");
      setLoading(false);
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setCreateTaskError("Please log in to create tasks");
        setLoading(false);
        return false;
      }
      const URL = import.meta.env.VITE_SERVER_URL;
      const body = { content };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const createTaskResponse = await axios.post(
        `${URL}/api/v1/task`,
        body,
        config
      );
      console.log("task created", createTaskResponse);
      setTasks((prevTasks) => [...prevTasks, createTaskResponse.data.task]);
      setCount((prevCount) => prevCount + 1);
      return true;
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect to the Server, please check internet connection";
      }
      if (error.response && error.response.status === 500) {
        errorMessage = "an internal error occured.. try again later !!";
      } else if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "failed to create task";
      }
      setCreateTaskError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (content: string, id: string) => {
    setLoading(true);
    setUpdateTaskError(null);
    if (content.trim() === "") {
      setUpdateTaskError("task cannot be empty");
      setLoading(false);
      return false;
    }
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setUpdateTaskError("token missing, login to update task");
        setLoading(false);
        return false;
      }
      const URL = import.meta.env.VITE_SERVER_URL;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const body = { content };
      const updateTaskResponse = await axios.patch(
        `${URL}/api/v1/task/${id}`,
        body,
        config
      );
      console.log("updated Task", updateTaskResponse.data.updateTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? updateTaskResponse.data.updateTask : task
        )
      );
      return true;
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect to the server. Check your internet connection.";
      } else if (error.response?.status === 400) {
        errorMessage = "Content cannot be empty or invalid.";
      } else if (error.response?.data?.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to update task.";
      }
      setUpdateTaskError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const URL = import.meta.env.VITE_SERVER_URL;
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("token missing, cannot delete task");
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const deleteTaskResponse = await axios.delete(
        `${URL}/api/v1/task/${id}`,
        config
      );
      console.log("task deleted ", deleteTaskResponse);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setCount((prevCount) => prevCount - 1);
    } catch (error: any) {
      console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect with server, check internet connection !!";
      } else if (error.response && error.respnse.status === 404) {
        errorMessage = "task not found";
      } else if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to delete task";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkTaskBox = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const taskToUpdate = tasks.find((task) => task._id === id);
        if (!taskToUpdate) {
          setLoading(false);
          return;
        }
        const URL = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("token missing, cannot update taskChecker");
          setLoading(false);
          return;
        }
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
        const body = { completed: !taskToUpdate.completed };
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.patch(
          `${URL}/api/v1/task/${id}`,
          body,
          config
        );
        console.log("taskchecker:", response);
      } catch (error: any) {
        console.error(error);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === id ? { ...task, completed: !task.completed } : task
          )
        );
          console.error(error);
      let errorMessage: string;
      if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Failed to connect with server, check internet connection !!";
      } else if (error.response && error.respnse.status === 404) {
        errorMessage = "tasks not found";
      } else if (error.response && error.response.data.msg) {
        errorMessage = error.response.data.msg;
      } else {
        errorMessage = "Failed to filter task";
      }
      setError(errorMessage);
        setError("Failed to update task completion status.");
      } finally {
        setLoading(false);
      }
    },
    [tasks]
  );

  useEffect(() => {
    let newFilteredTasks: TaskTypes[] = [];
    if (filterState === "all") {
      newFilteredTasks = tasks;
    } else if (filterState === "completed") {
      newFilteredTasks = tasks.filter((task) => task.completed);
    } else {
      // Incomplete
      newFilteredTasks = tasks.filter((task) => !task.completed);
    }

    setFilteredTasks(newFilteredTasks);
  }, [tasks, filterState]);

  return (
    <TaskContext.Provider
      value={{
        fetchAllTasks,
        createTask,
        updateTask,
        deleteTask,
        state,
        setFilterState,
        checkTaskBox,
        resetTaskState,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const UseTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error(
      "useTaskContext should only be used within a taskProvider "
    );
  }

  return context;
};

// import { useEffect, type ReactNode } from "react";
// import { useContext, createContext, useReducer, useCallback } from "react";
// import axios from "axios";

// // const{token, setToken} = useAuthContext()

// interface Task {
//   _id: string;
//   content: string;
//   createdBy: string;
//   completed: string;
//   createdAt: string;
// }

// interface TextContextType {
//   state: TaskState;
//   fetchTasks: () => Promise<void>;
//   createTask: (content: string) => Promise<void>;
//   updateTask: (id: string, content: string) => Promise<void>;
//   deleteTask: (id: string) => Promise<void>;
// }

// export const TaskContext = createContext<TextContextType | undefined>(
//   undefined
// );

// interface TaskState {
//   tasks: Task[];
//   loading: boolean;
//   error: string | null;
// }

// type TaskAction =
//   | { type: "FETCH_TASKS_REQUEST" }
//   | { type: "FETCH_ALL_TASKS_SUCCESS"; payload: Task[] }
//   | { type: "FETCH_TASKS_FAILURE"; payload: string }
//   | { type: "CREATE_TASK_SUCCESS"; payload: Task }
//   | { type: "UPDATE_TASK_SUCCESS"; payload: Task }
//   | { type: "DELETE_TASK"; payload: string }
//   | { type: "ERROR_MESSAGE"; payload: string | null };

// const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
//   switch (action.type) {
//     case "FETCH_TASKS_REQUEST":
//       return { ...state, loading: true, error: null };
//     case "FETCH_ALL_TASKS_SUCCESS":
//       return { ...state, loading: false, tasks: action.payload, error: null };
//     case "FETCH_TASKS_FAILURE":
//       return { ...state, loading: false, error: action.payload };
//     case "CREATE_TASK_SUCCESS":
//       return {
//         ...state,
//         loading: true,
//         tasks: [...state.tasks, action.payload],
//         error: null,
//       };
//     case "UPDATE_TASK_SUCCESS":
//       return {
//         ...state,
//         loading: true,
//         error: null,
//         tasks: state.tasks.map((task) =>
//           task._id === action.payload._id ? action.payload : task
//         ),
//       };
//     case "DELETE_TASK":
//       return {
//         ...state,
//         loading: false,
//         error: null,
//         tasks: state.tasks.filter((task) => task._id !== action.payload),
//       };
//     case "ERROR_MESSAGE":
//       return { ...state, error: action.payload, loading: false };

//     default:
//       return state;
//   }
// };

// // function fetching data from api
// export const TaskProvider = ({ children }: { children: ReactNode }) => {
//   const [state, dispatch] = useReducer(taskReducer, {
//     tasks:[],
//     loading:false,
//     error:null
//   });

//   const fetchTasks = useCallback(async()=> {
//     try {
//         dispatch({type:"FETCH_TASKS_REQUEST"})
//         const token = localStorage.getItem('AuthToken')
//         if (!token) {
//                 throw new Error('Please log in to view tasks');
//             }
//         const URL = import.meta.env.VITE_SERVER_URL
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             }
//         }
//         const findAllTasksResponse = await axios.get(`${URL}/api/v1/task`, config)
//         console.log('getalldata:', findAllTasksResponse.data);

//         dispatch({type: 'UPDATE_TASK_SUCCESS', payload:findAllTasksResponse.data})

//     } catch (error:any) {
//         console.error(error)
//         const errorMessage = error.response?.status === '401' ? 'unauthorized user, please login' : error.findAllTasksResponse.data.msg || 'failed to fetch tasks';
//         dispatch({type:'FETCH_TASKS_FAILURE', payload:errorMessage})
//     }

//   }, [])

//   const createTask = useCallback(async(content: string)=> {
//     try {
//         dispatch({type:'FETCH_TASKS_REQUEST'})
//         const token = localStorage.getItem('authToken')
//           if (!token) {
//                 throw new Error('Please log in to view tasks');
//             }
//         const URL = import.meta.env.VITE_SERVER_URL
//         const body = {content}
//         const config = {
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             }
//         }
//         const createTaskResponse = await axios.post(`${URL}/api/v1/task`, body, config)
//         console.log('task created', createTaskResponse);
//         dispatch({type:'CREATE_TASK_SUCCESS', payload:createTaskResponse.data.task})

//     } catch (error:any) {
//         console.error(error);
//         const errorMessage = error.createTaskResponse.data.msg || 'failed to create task'
//         dispatch({type:'ERROR_MESSAGE', payload:errorMessage})
//     }

//   }, [])

//   const updateTask = useCallback(async(id:string, content:string)=> {
//     try {
//         dispatch({type:'FETCH_TASKS_REQUEST'})
//         const URL = import.meta.env.VITE_SERVER_URL
//         const token = localStorage.getItem('authToken')
//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             }
//         }
//         const body = {content}
//         const updateTaskResponse = await axios.patch(`${URL}/api/v1/tasl/${id}`, body, config)
//         console.log('updated Task', updateTaskResponse.data.updateTask);
//         dispatch({type:'UPDATE_TASK_SUCCESS', payload: updateTaskResponse.data.updateTask})

//     } catch (error:any) {
//         console.error(error);
//         const errorMessage = error.updateTaskResponse?.status === '400' ?' content cannot be empty' :
//         error.updateTaskResponse.data.msg || 'failed to update task'
//         dispatch({type:"ERROR_MESSAGE", payload:errorMessage})

//     }

//   }, [])

//   const deleteTask = useCallback(async(id:string)=> {
//       try {
//         dispatch({type:'FETCH_TASKS_REQUEST'})
//           const URL = import.meta.env.VITE_SERVER_URL
//         const token = localStorage.getItem('authToken')
//         const config = {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`
//             }
//         }
//         const deleteTaskResponse = await axios.delete(`${URL}/api/v1/task/${id}`, config)
//         console.log('task deleted ', deleteTaskResponse);
//         dispatch({type:'DELETE_TASK', payload: deleteTaskResponse.data.msg})

//     } catch (error:any) {
//         console.error(error);
//         const errorMessage = error.deleteTasKResponse?.status === '404' ? 'task not found':
//         error.deleteTaskResponse.data.msg || 'failed to delete task'
//         dispatch({type:'ERROR_MESSAGE', payload:errorMessage})

//     }

//   }, [])

//   useEffect(() => {
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             fetchTasks();
//         }
//     }, []);

//   return (
//     <TaskContext.Provider value={{state, fetchTasks, createTask,deleteTask,updateTask,}}>
//       {children }
//     </TaskContext.Provider>
//   );
// };

// export const UseTaskContextHook = () => {
//   const context = useContext(TaskContext);
//   if (!context) {
//     throw new Error(
//       "useTaskContextHook should be only used within a taskcontext Provider"
//     );
//   }
//   return context;
// };
