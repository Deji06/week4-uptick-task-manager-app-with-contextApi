import React, { useState } from "react";
import { UseTaskContext } from "../contexts/TaskContext";
import AddTodoForm from "./AddTodoForm";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import backGroundImage from '../assets/images/pexels-thepaintedsquare-3361492.jpg'
import { useAuthContext } from '../hooks/authContextHook'

interface TaskTypes {
  _id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

export const TaskDashboard = () => {
  const navigate = useNavigate()
  const [displayTodoForm, setDisplayTodoForm] = useState<boolean>(true);
  const [displayEditForm, setDisplayEditForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<string>("");
  const [currentTask, setCurrentTask] = useState<TaskTypes | null>(null);

  const { updateTask,
     deleteTask, 
     state: { updateTaskError, loading, tasks, count, filterState, filteredTasks}, 
     checkTaskBox, 
     setFilterState , 
     resetTaskState} = UseTaskContext();
    const {logOut} = useAuthContext()

  const handleEdit = (task: TaskTypes) => {
    setDisplayEditForm(!displayEditForm);
    setCurrentTask(task);
    setEdit(task.content);
  };


  const handleEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTask) {
        const success = await updateTask(edit, currentTask?._id);
        if(success) {
          console.log(`Updated task with new content: ${edit}`);
          setCurrentTask(null);
          setEdit("");
          setDisplayEditForm(false);
          console.log(edit);

        }
      }
    } catch(error:any) {
      console.error(error)
      setDisplayTodoForm(true);
      setDisplayEditForm(true)
    }
  };

  const cancelEditForm = () => {
    setDisplayEditForm(false);
    setCurrentTask(null)
    setEdit('')
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState(e.target.value as 'all' | "incomplete" | 'completed')
  }

  const handleCheck = async(id:string) => {
       await checkTaskBox(id)
  }

  const handleLogOut = () => {
    logOut()
    resetTaskState()
    navigate('/login')
  }

  return (
    <div className="pb-20 bg-cover min-h-screen relative py-14 md:py-10"
     style={{ backgroundImage: `url(${backGroundImage})` }}
    
    >
      <button
        className="text-white  w-[100px] bg-red-900 px-5 py-2 capitalize rounded cursor-pointer  ml-5 absolute md:top-[25px] top-[15px] right-5"
        onClick={handleLogOut}
        >
          log out
        </button>

      <p className="text-red-900 uppercase text-center font-bold text-[30px] w-fit m-auto ">
        Task manager
      </p>
      {/* {error && <p className="text-[20px] text-red-500">{error}</p>} */}
      <div className="sm:w-[50%] mx-5 sm:mx-0 md:m-auto  mt-5 flex justify-between">
        <button
          className=" text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
          onClick={() => setDisplayTodoForm(!displayTodoForm)}
        >
          add task
        </button>
        <select
          value={filterState}
          onChange={handleFilterChange}
          className="text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
        >
          <option value="all">all</option>
          <option value="incomplete">incomplete</option>
          <option value="completed">completed</option>
        </select>
      </div>
      {displayTodoForm && <AddTodoForm
          displayTodoForm={displayTodoForm}
          setDisplayTodoForm={setDisplayTodoForm}
        />
      }
      {loading && (
        <p className="text-red-900 text-center text-[20px] capitalize">
          loading all tasks....
        </p>
      )}

      {tasks.length > 0 && (
        <div className="sm:w-[50%] mt-10 mx-5 sm:mx-0 md:m-auto h-full md:mt-10 rounded bg-[#CCCDDE] px-5 md:mb-10 ">
          <div className="flex justify-between py-2">
            <p className="capitalize font-bold ">
              total tasks: <span className="text-red-900 font-bold">{count}</span>{" "}
            </p>
            <p className="capitalize font-bold ">
              tasks to do: <span className="text-red-900 ">{tasks.filter(task=>!task.completed).length}</span>
            </p>

          </div>
            {filteredTasks.map((task) => (
              <div className="flex justify-between mt-2 pb-3" >
                <li key={task._id} className="flex gap-x-3">
                  <input type="checkbox" 
                   checked={task.completed}
                   onChange={() => handleCheck(task._id)}
                   />
                   <p className={task.completed ? "line-through": ''}>{task.content}</p>
                </li>
                <div className="flex gap-x-3 items-center">
                  <button
                    className=" text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
                    onClick={() => handleEdit(task)}
                  >
                    <CiEdit />
                  </button>
                  <button
                    className=" text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
                    onClick={() => deleteTask(`${task._id}`)}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex flex-col">
              {displayEditForm && (
                <form
                  action=""
                  className=" md:w-[50%] w-[100%] pb-5"
                  onSubmit={handleEditForm}
                >
                  <input
                    type="text"
                    className="border bg-white w-[60%] rounded outline-none py-1 px-2"
                    value={edit}
                    onChange={(e) => setEdit(e.target.value)}
                  />
                  {updateTaskError && <p className="text-red-500">{updateTaskError}</p>}
                  <div className="flex gap-x-4 mt-3 mb-3">
                    <button
                      type="submit"
                      className="text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
                    >
                      update
                    </button>
                    <button
                      type="button"
                      className="text-white bg-red-900 px-5 py-2 rounded cursor-pointer"
                      onClick={cancelEditForm}
                    >
                      cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
        </div>
      )}
    </div>
  );
};
