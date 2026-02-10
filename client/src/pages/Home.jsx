import Header from '../components/Header.jsx'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL


function Home() {
  const navigate = useNavigate()
  const [activeList, setActiveList] = useState(null)
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tasks, setTasks] = useState([])

  // Fetch lists from backend on mount
  const fetchLists = async () => {
  try {
    setLoading(true)
    const response = await fetch(`${API_URL}/api/lists`) // only one /api
    const data = await response.json()
    if (data.success) {
      setLists(data.lists)
    } else {
      setError('Failed to load lists')
    }
  } catch (err) {
    setError('Error connecting to server')
    console.error(err)
  } finally {
    setLoading(false)
  }
}


  const addList = async (title, description = '') => {
    try {
      const response = await fetch(`${API_URL}/api/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, status: 'pending' })
      })
      const data = await response.json()
      if (data.success) {
        setLists([data.list, ...lists])
      }
    } catch (err) {
      console.error('Error adding list:', err)
    }
  }

  const deleteList = async (listId) => {
    try {
      const response = await fetch(`${API_URL}/api/lists/${listId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setLists(lists.filter(l => l.id !== listId))
        setActiveList(null)
      }
    } catch (err) {
      console.error('Error deleting list:', err)
    }
  }

  const updateList = async (listId, title, description) => {
    try {
      const response = await fetch(`${API_URL}/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })
      const data = await response.json()
      if (data.success) {
        setLists(lists.map(l => l.id === listId ? { ...l, title, description } : l))
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Error updating list:', err)
    }
  }

  const toggleListStatus = async (listId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    try {
      const list = lists.find(l => l.id === listId)
      const response = await fetch(`${API_URL}/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: list.title, description: list.description, status: newStatus })
      })
      const data = await response.json()
      if (data.success) {
        setLists(lists.map(l => l.id === listId ? { ...l, status: newStatus } : l))
      }
    } catch (err) {
      console.error('Error toggling list status:', err)
    }
  }

  const addTask = async (listId, taskDescription) => {
    try {
      const response = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_id: listId, description: taskDescription, status: 'pending' })
      })
      const data = await response.json()
      if (data.success) {
        setTasks([...tasks, data.item])
      }
      
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_URL}/api/items/${taskId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  const toggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
    try {
      const response = await fetch(`${API_URL}/api/items/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.success) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      }
    } catch (err) {
      console.error('Error toggling task status:', err)
    }
  }

  return (
    <>
      <Header />

      <main className="container mx-auto p-4 max-w-4xl">
        {/* Header with Logout Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My To-Do Lists</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
            >
              {showForm ? 'Cancel' : 'Add List'}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              ← Logout
            </button>
          </div>
        </div>

       
        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* If no list is selected, show lists */}
        {!loading && !activeList && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lists.map((list) => (
                <div key={list.id} className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    checked={list.status === 'completed'}
                    onChange={() => toggleListStatus(list.id, list.status)}
                    className="mt-2 w-5 h-5 cursor-pointer"
                  />
                  <button
                    onClick={() => setActiveList(list.id)}
                    className="flex-1 p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer text-left"
                  >
                    <h2 className={`text-2xl font-bold mb-2 ${
                      list.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}>{list.title}</h2>
                    <p className={`mb-4 ${list.status === 'completed' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {list.description || 'No description'}
                    </p>
                    <p className={`text-sm font-semibold ${
                      list.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      Status: {list.status}
                    </p>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6">
              {showForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const title = e.target.elements.listTitle.value
                  const description = e.target.elements.listDescription.value
                  if (title.trim()) {
                    addList(title, description)
                    e.target.reset()
                    setShowForm(false)
                  }
                }}
                className="bg-white p-6 rounded-lg shadow space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-800">Create New List</h3>
                <input
                  type="text"
                  name="listTitle"
                  placeholder="List title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
                <textarea
                  name="listDescription"
                  placeholder="Description (optional)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  rows="2"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Create List
                </button>
              </form>
              )}
            </div>
          </div>
        )}

        {/* Show selected list details */}
        {!loading && activeList && (
          <div>
            {/* Back button to list categories */}
            <button
              onClick={() => setActiveList(null)}
              className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Lists
            </button>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={lists.find(l => l.id === activeList)?.status === 'completed'}
                    onChange={() => {
                      const list = lists.find(l => l.id === activeList)
                      toggleListStatus(activeList, list.status)
                    }}
                    className="mt-2 w-6 h-6 cursor-pointer"
                  />
                  <div>
                    <h2 className={`text-3xl font-bold ${
                      lists.find(l => l.id === activeList)?.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'
                    }`}>
                      {lists.find(l => l.id === activeList)?.title}
                    </h2>
                    <p className={`mt-2 ${
                      lists.find(l => l.id === activeList)?.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {lists.find(l => l.id === activeList)?.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit List'}
                  </button>
                  <button
                    onClick={() => deleteList(activeList)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete List
                  </button>
                </div>
              </div>

              
              {isEditing && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const title = e.target.elements.editTitle.value
                  const description = e.target.elements.editDescription.value
                  if (title.trim()) {
                    updateList(activeList, title, description)
                  }
                }}
                className="bg-gray-50 p-6 rounded-lg space-y-4"
              >
                <h3 className="text-xl font-bold text-gray-800">Edit List</h3>
                <input
                  type="text"
                  name="editTitle"
                  defaultValue={lists.find(l => l.id === activeList)?.title}
                  placeholder="List title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <textarea
                  name="editDescription"
                  defaultValue={lists.find(l => l.id === activeList)?.description}
                  placeholder="Description (optional)..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="2"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Save Changes
                </button>
              </form>
              )}
              
              {!isEditing && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Tasks</h3>
                
                {/* Add Task Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const taskDescription = e.target.elements.taskInput.value
                    if (taskDescription.trim()) {
                      addTask(activeList, taskDescription)
                      e.target.reset()
                    }
                  }}
                  className="flex gap-2 mb-6"
                >
                  <input
                    type="text"
                    name="taskInput"
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                  >
                    Add Task
                  </button>
                </form>
                
                {/* Tasks List */}
                <div className="space-y-2">
                  {tasks.filter(t => t.list_id === activeList).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No tasks yet. Add one to get started!</p>
                  ) : (
                    tasks.filter(t => t.list_id === activeList).map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <input
                          type="checkbox"
                          checked={task.status === 'completed'}
                          onChange={() => toggleTaskStatus(task.id, task.status)}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className={`flex-1 ${
                          task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'
                        }`}>
                          {task.description}
                        </span>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Home