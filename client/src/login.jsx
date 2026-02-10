import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { name, password },
        { withCredentials: true }
      )

      // If backend returns 200, login is successful
      if (response.status === 200) {
        setMessage('Login successful! Redirecting...')
        setMessageType('success')
        setTimeout(() => {
          navigate('/home') // make sure your route is "/home"
        }, 1500)
      } else {
        setMessage(response.data.message || 'Invalid credentials')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      )
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-400">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          Login
        </h1>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Sign in to your account
        </p>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg mb-6 text-sm ${
              messageType === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 font-semibold text-gray-800 text-sm">
              Username or name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your username or name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-800 text-sm">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-bold text-base transition-all duration-300 hover:bg-orange-600 hover:shadow-lg mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-orange-500 font-semibold hover:text-orange-600 no-underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
