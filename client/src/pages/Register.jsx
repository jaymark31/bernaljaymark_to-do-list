import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Register() {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'error' or 'success'
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateForm = () => {
    if (!username.trim()) {
      setMessage('Username is required')
      setMessageType('error')
      return false
    }
    if (!name.trim()) {
      setMessage('Name is required')
      setMessageType('error')
      return false
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      setMessageType('error')
      return false
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return false
    }
    return true
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('')

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        { username, name, password, confirm: confirmPassword },
        { withCredentials: true }
      )

      if (response.data.success) {
        setMessage('Registration successful! Redirecting to login...')
        setMessageType('success')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        setMessage(response.data.message || 'Registration failed')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage(
        error.response?.data?.message || 'Registration failed. Please try again.'
      )
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-400 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
          <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
            Create Account
          </h1>
          <p className="text-center text-gray-500 mb-8 text-sm">
            Join us and start managing your tasks
          </p>

          {message && (
            <div className={`px-4 py-3 rounded-lg mb-6 text-sm ${
              messageType === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block mb-2 font-semibold text-gray-800 text-sm">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-800 text-sm">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
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
              <p className="text-gray-500 text-xs mt-1">
                At least 6 characters
              </p>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-800 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg font-bold text-base transition-all duration-300 hover:bg-orange-600 hover:shadow-lg mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account? <a href="/login" className="text-orange-500 font-semibold hover:text-orange-600 no-underline transition-colors">Sign in</a>
            </p>
          </div>
        </div>
    </div>
  )
}

export default Register