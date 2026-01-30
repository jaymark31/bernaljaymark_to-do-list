import Header from '../components/Header.jsx'
import { useLocation, useNavigate } from 'react-router-dom'

function ListItem() {
    const location = useLocation()
    const navigate = useNavigate()

    // If Home passed items via route state use them, otherwise fallback to defaults
    const passed = location.state
    const title = passed?.title || 'List Items'
    const initialItems = (passed?.items || []).map((it, i) => ({
        id: it.id ?? i + 1,
        text: it.text ?? it.title,
        description: it.description ?? '',
        status: String(it.status || 'pending').toLowerCase()
    }))

    const [tasks, setTasks] = useState(initialItems)
    const [removed, setRemoved] = useState([])

    const toggleStatus = (id) => {
        setTasks((prev) => prev.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t))
    }

    const removeTask = (id) => {
        setTasks((prev) => {
            const found = prev.find(p => p.id === id)
            if (!found) return prev
            setRemoved(r => [found, ...r])
            return prev.filter(p => p.id !== id)
        })
    }

    const restoreTask = (id) => {
        setRemoved((prev) => {
            const found = prev.find(p => p.id === id)
            if (!found) return prev
            setTasks(t => [found, ...t])
            return prev.filter(p => p.id !== id)
        })
    }

    return (
        <>
            <Header />
            <main className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                        {passed?.id && <p className="text-sm text-gray-500">List ID: {passed.id}</p>}
                    </div>
                    <div>
                        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back</button>
                    </div>
                </div>

                <section className="bg-white rounded-lg shadow overflow-hidden mb-6">
                    {tasks.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No tasks in this list.</div>
                    ) : (
                        <ul className="divide-y">
                            {tasks.map(task => (
                                <li key={task.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <input type="checkbox" checked={task.status === 'completed'} onChange={() => toggleStatus(task.id)} className="w-4 h-4" />
                                        <div>
                                            <div className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.text}</div>
                                            {task.description && <div className="text-xs text-gray-500">{task.description}</div>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => removeTask(task.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {removed.length > 0 && (
                    <section className="bg-white rounded-lg shadow p-4">
                        <h2 className="font-semibold mb-2">Removed tasks (restore)</h2>
                        <ul className="divide-y">
                            {removed.map(r => (
                                <li key={r.id} className="p-3 flex items-center justify-between">
                                    <div className="text-sm">{r.text}</div>
                                    <button onClick={() => restoreTask(r.id)} className="text-sm text-blue-600 hover:underline">Add back to list</button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </>
    )
}

export default ListItem