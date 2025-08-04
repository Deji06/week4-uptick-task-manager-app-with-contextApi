import React, { useState } from 'react'
import { UseTaskContext } from '../contexts/TaskContext'
import AddTodoForm from './AddTodoForm'
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
// import { useAuthContext } from '../hooks/authContextHook'


interface TaskTypes {
    _id: string;
    content: string;
    completed: boolean;
    createdAt: string;
}


export const TaskDashboard = () => {
    const[displayTodoForm, setDisplayTodoForm] = useState<boolean>(true)
    const[displayEditForm, setDisplayEditForm] = useState<boolean>(false)
    const[edit, setEdit] = useState<string>('')
    const[currentTask, setCurrentTask] = useState<TaskTypes | null>(null)

    const{updateTask, deleteTask,  state:{error, loading, tasks, count}} = UseTaskContext()
    //    const {username} = useAuthContext()

    const handleEdit = (task: TaskTypes) => {
        setDisplayEditForm(true)
        setCurrentTask(task)
        setEdit(task.content)
    }

      const handleEditForm = async(e: React.FormEvent) => {
        e.preventDefault()
        if(currentTask) {
            await updateTask(edit, currentTask?._id)
             console.log(`Updated task with new content: ${edit}`);
        }
        setCurrentTask(null);
        setEdit('');
        setDisplayEditForm(false);
        // setDisplayTodoForm(true);
        console.log(edit);
    }

      const cancelEditForm = () => {
        setDisplayEditForm(false)
    }
       
    
  return (
    <div className='mb-5'>
    <p className='text-red-900 uppercase text-center mt-10 font-bold text-[30px] '>Task manager</p>
    {error && <p className='text-[20px] text-red-500'>{error}</p>}
    <div className='sm:w-[50%] mx-5 sm:mx-0 md:m-auto  mt-5 flex justify-between'>
        <button 
         className=' text-white bg-red-900 px-5 py-2 rounded cursor-pointer'
         onClick={() => setDisplayTodoForm(!displayTodoForm)}
         >
            add task
        </button>
        <select name="" id="" className='border text-white bg-red-900 px-5 py-2 rounded'>
            <option value="">all</option>
            <option value="">incomplete</option>
            <option value="">completed</option>
        </select>
    </div>
    {displayTodoForm ?  <AddTodoForm  displayTodoForm= {displayTodoForm} setDisplayTodoForm = {setDisplayTodoForm}  /> :  ''}
    {loading && <p className='text-red-900 text-center text-[20px]'>loading all tasks....</p>}

    {tasks.length !== 0  && (
        <div className='sm:w-[50%] mx-5 sm:mx-0 md:m-auto  md:mt-10 rounded bg-[#CCCDDE] px-5'>
            <p className='capitalize font-bold '>task todo: <span className='text-red-900 font-bold'>{count}</span> </p>
            <ul className=''>
                {tasks.map((task) => (
                    <div className='flex justify-between mt-2'>
                        <li key={task._id} className='flex gap-x-3'>
                            <input type="checkbox" />
                            <p>{task.content}</p>
                        </li>
                        <div className='flex gap-x-3 items-center'>
                             <button 
                                className='cursor-pointer'
                                onClick={() => handleEdit(task)}>
                                <CiEdit />
                            </button>
                            <button 
                                className='cursor-pointer'
                                onClick={()=> deleteTask(`${task._id}`)}>
                                <MdDeleteOutline />
                            </button>
                        </div>
                    </div>
                 
                ))}
            </ul>
                {displayEditForm && 
                    <form action="" className='border w-[50%]' onSubmit={handleEditForm}>
                        <input type="text" 
                            className='bg-white border'
                            value={edit}
                            onChange={(e) => setEdit(e.target.value)} 
                        />
                            <div className='flex gap-x-4'>
                                <button type='submit'>save</button>
                                <button type='button' onClick={cancelEditForm}>cancel</button>
                            </div>
                    </form>
                }
        </div>

    )}

    
    </div>

  )
}

