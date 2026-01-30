import Header from '../components/Header.jsx'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()
  const [activeList, setActiveList] = useState(null)
  const [lists, setLists] = useState({
    backlog: {
      title: 'Backlog',
      description: 'Ideas and future features',
      tasks: [
        { id: 1, text: 'Design auth flow', completed: false },
        { id: 2, text: 'Draft API docs', completed: false },
        { id: 3, text: 'Research caching strategy', completed: true }
      ]
    },
    sprint: {
      title: 'Sprint',
      description: 'This sprint work items',
      tasks: [
        { id: 4, text: 'Implement login API', completed: false },
        { id: 5, text: 'Finish todo CRUD endpoints', completed: true },
        { id: 6, text: 'Integrate frontend with API', completed: false }
      ]
    },
    techdebt: {
      title: 'Tech Debt',
      description: 'Refactors, upgrades, and fixes',
      tasks: [
        { id: 7, text: 'Refactor user service', completed: false },
        { id: 8, text: 'Upgrade dependencies', completed: false },
        { id: 9, text: 'Add unit tests', completed: true }
      ]
    }
  })

  const toggleTask = (listKey, taskId) => {
    setLists(prev => ({
      ...prev,
      [listKey]: {
        ...prev[listKey],
        tasks: prev[listKey].tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      }
    }))
  }

  const deleteTask = (listKey, taskId) => {
    setLists(prev => ({
      ...prev,
      [listKey]: {
        ...prev[listKey],
        tasks: prev[listKey].tasks.filter(t => t.id !== taskId)
      }
    }))
  }

  const addTask = (listKey, newTaskText) => {
    if (!newTaskText.trim()) return
    
    const newId = Math.max(
      ...Object.values(lists).flatMap(list => list.tasks.map(t => t.id)),
      0
    ) + 1
    
    setLists(prev => ({
      ...prev,
      [listKey]: {
        ...prev[listKey],
        tasks: [...prev[listKey].tasks, { id: newId, text: newTaskText, completed: false }]
      }
    }))
  }

  return (
    <>
      <Header />

      <main className="container mx-auto p-4 max-w-4xl">
        {/* Header with Logout Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">My To-Do Lists</h1>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            ← Logout
          </button>
        </div>

        {/* If no list is selected, show category buttons */}
        {!activeList ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(lists).map(([key, list]) => {
              const completedCount = list.tasks.filter(t => t.completed).length
              return (
                <button
                  key={key}
                  onClick={() => setActiveList(key)}
                  className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer text-left"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{list.title}</h2>
                  <p className="text-gray-600 mb-4">{list.description}</p>
                  <p className="text-sm text-orange-600 font-semibold">
                    {completedCount} of {list.tasks.length} completed
                  </p>
                </button>
              )
            })}
          </div>
        ) : (
          // Show task list when a category is selected
          <div>
            {/* Back button to list categories */}
            <button
              onClick={() => setActiveList(null)}
              className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              ← Back to Lists
            </button>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{lists[activeList].title}</h2>

              {/* Add Task Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const input = e.target.elements.newTask
                  addTask(activeList, input.value)
                  input.value = ''
                }}
                className="flex gap-3 mb-6"
              >
                <input
                  type="text"
                  name="newTask"
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Add
                </button>
              </form>

              {/* Task List */}
              {lists[activeList].tasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No tasks in this list. Add one to get started!</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {lists[activeList].tasks.map((task) => (
                    <li key={task.id} className="p-4 flex items-center justify-between bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(activeList, task.id)}
                          className="w-5 h-5 cursor-pointer accent-orange-500"
                        />
                        <span
                          className={`text-base ${
                            task.completed
                              ? 'line-through text-gray-400'
                              : 'text-gray-800'
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTask(activeList, task.id)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors font-semibold"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Home