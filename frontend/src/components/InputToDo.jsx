import React from 'react'

function InputToDo() {
  return (
    <div>
        <form action="">
            <input className='text-2xl pl-3 py-2 text-white w-[70%] rounded-lg outline-none bg-slate-800' placeholder='Add New To-Do' type="text" />
            <button type='submit' className='ml-3 bg-green-500 text-2xl py-2 px-3 rounded-md cursor-pointer'>Add</button>
        </form>
    </div>
  )
}

export default InputToDo