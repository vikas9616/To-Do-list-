import React, { useState, useEffect } from 'react';

const ToDoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [deletedTasks, setDeletedTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the server
    fetch('/api/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = { text: newTask, status: 'active' };

    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
      .then(response => response.json())
      .then(data => setTasks([...tasks, data]));

    setNewTask('');
  };

  const updateTaskStatus = (id, status) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
      .then(() => {
        const updatedTasks = tasks.map(task =>
          task._id === id ? { ...task, status } : task
        );
        setTasks(updatedTasks);
      });
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(task => task._id === id);
    fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        const updatedTasks = tasks.filter(task => task._id !== id);
        setTasks(updatedTasks);
        setDeletedTasks([...deletedTasks, taskToDelete]);
      });
  };

  const restoreTasks = () => {
    setTasks([...tasks, ...deletedTasks]);
    setDeletedTasks([]);
  };

  const startEditTask = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const saveEditTask = () => {
    fetch(`/api/tasks/${editTaskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: editTaskText })
    })
      .then(() => {
        const updatedTasks = tasks.map(task =>
          task._id === editTaskId ? { ...task, text: editTaskText } : task
        );
        setTasks(updatedTasks);
        setEditTaskId(null);
        setEditTaskText('');
      });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">ToDoList</h1>
        <div className="flex mb-4">
          <input
            type="text"
            className="flex-grow p-2 rounded-l-lg border-none bg-gray-900 text-white outline-none"
            placeholder="Add New To-Do"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button
            className="bg-green-500 text-white p-2 rounded-r-lg"
            onClick={addTask}
          >
            Add
          </button>
        </div>
        <div className="text-white mb-2">
          <div className="flex justify-around mb-4">
            <button
              className={`p-2 ${filter === 'active' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400 rounded-lg`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`p-2 ${filter === 'pending' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400 rounded-lg`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={`p-2 ${filter === 'completed' ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-400 rounded-lg`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
          <button
            className="bg-yellow-500 text-white p-2 rounded-lg mb-4"
            onClick={restoreTasks}
          >
            Restore Deleted Tasks
          </button>
          <div>
            {filteredTasks.map(task => (
              <div key={task._id} className="flex justify-between items-center mt-2">
                {editTaskId === task._id ? (
                  <input
                    type="text"
                    className="flex-grow p-2 bg-gray-900 text-white rounded-lg outline-none"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center">
                    {task.status !== 'completed' && (
                      <input
                        type="checkbox"
                        className="mx-1"
                        checked={task.status === 'completed'}
                        onChange={() => updateTaskStatus(task._id, 'completed')}
                      />
                    )}
                    <span>{task.text}</span>
                  </div>
                )}
                <div className="flex">
                  {editTaskId === task._id ? (
                    <button
                      className="bg-green-500 text-white p-2 mx-1 rounded-lg"
                      onClick={saveEditTask}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      {task.status === 'active' && (
                        <button
                          className="bg-blue-500 text-white p-2 mx-1 rounded-lg"
                          onClick={() => updateTaskStatus(task._id, 'pending')}
                        >
                          Pending
                        </button>
                      )}
                      <button
                        className="bg-red-500 text-white p-2 mx-1 rounded-lg"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-yellow-500 text-white p-2 mx-1 rounded-lg"
                        onClick={() => startEditTask(task._id, task.text)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoApp;
