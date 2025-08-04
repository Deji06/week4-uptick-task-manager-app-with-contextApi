import React, {useState } from 'react'
import { useAuthContext } from '../hooks/authContextHook';
import { UseTaskContext } from '../contexts/TaskContext';

interface todoFormProps {
    displayTodoForm: boolean;
    setDisplayTodoForm : (displayTodoForm:boolean) => void
}


const AddTodoForm: React.FC<todoFormProps> = ({ setDisplayTodoForm }) => {
    const{createTask, state:{error}} = UseTaskContext()
    const{loading, setLoading} = useAuthContext()
    const[content, setContent] = useState('')
    const[clientError, setClientError] = useState('')

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault()
        if(content.trim() === ''){
            setClientError('task content cannot be empty!!!')
        return;
        }
        setLoading(false)

        try {
            setLoading(true)
            await createTask(content)
            localStorage.setItem('tasks', content)
            setContent('')  
        } catch (error:any) {
            setClientError(error.message || 'failed to create task')
            console.error(error)
        }finally{
            setLoading(false)
        }

    }

  return (
    <>
    <div className='md:w-[50%] mx-5 sm:mx-0 md:m-auto bg-[#CCCDDE] rounded mt-5 md:mt-5 space-y-3 p-5 '>
        <p className='text-red-900 text-[20px] font-bold capitalize'>add todo</p>
        <form action="" className='' onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder='enter task for today' 
                className='border bg-white w-[60%] rounded outline-none py-1 placeholder:px-2'
                value={content}
                onChange={(e)=> setContent(e.target.value)}
            />
            {clientError? <p className='text-red-500'>{clientError}</p>: ''}
            {error && <p className="text-red-500">{error}</p>}
            <div className='mt-2 flex justify-between w-[60%]'>
                <button type='submit' className=' text-white bg-red-900 px-5 py-2 capitalize rounded cursor-pointer'>{
                     loading? 'adding task....' : 'add task'
                    }
                </button>
                <button 
                    type='button' 
                    className=' text-white bg-red-900 px-5 py-2 rounded cursor-pointer' 
                    onClick={()=> setDisplayTodoForm(false)}
                >
                    cancel
                </button>
            </div>

        </form>

    </div>
    
    </>
  )
}

export default AddTodoForm