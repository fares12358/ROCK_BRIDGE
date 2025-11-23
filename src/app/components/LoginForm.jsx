'use client'
import React, { useState } from 'react'
import axios from 'axios'
import { FaEnvelope, FaLock, FaSpinner, FaSignInAlt, FaQuestion, FaEye, FaEyeSlash } from 'react-icons/fa'
import { Toaster, toast } from 'react-hot-toast'
import { useAppContext } from '../context/contextApi'

const API_BASE = 'http://localhost:5000/api/auth'

export default function LoginForm() {
    const { user, setUser, isLogin, setIsLogin } = useAppContext()

  const [email, setEmail] = useState('fares.dev.m@gmail.com')
  const [password, setPassword] = useState('456789')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // forgot password
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const validateEmail = (e) => {
    return /^\S+@\S+\.\S+$/.test(e)
  }

  const handleLogin = async (ev) => {
    ev && ev.preventDefault()
    if (!validateEmail(email)) return toast.error('Please enter a valid email')
    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters')

    setLoading(true)
    try {
      const payload = { email, password }
      const resp = await axios.post(`${API_BASE}/login`, payload, { timeout: 10000 })

      if (resp && resp.data) {
        toast.success(resp.data.message || 'Logged in successfully')
        if (resp.data.accessToken) {
          try { localStorage.setItem('authToken', resp.data.accessToken) } catch(e){}
        }
        setIsLogin(true)
        setUser(resp.data.user)
        setEmail('')
        setPassword('')
      } else {
        toast.success('Login completed')
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message
      toast.error(serverMsg || 'Login failed — check credentials or server')
    } finally {
      setLoading(false)
    }
  }

  const handleForgot = async (ev) => {
    ev && ev.preventDefault()
    if (!validateEmail(forgotEmail)) return toast.error('Please enter a valid email for password reset')

    setForgotLoading(true)
    try {
      const resp = await axios.post(`${API_BASE}/forgot`, { email: forgotEmail }, { timeout: 10000 })
      if (resp && resp.data) {
        toast.success(resp.data.message || 'If that email exists, a reset message has been sent')
        setForgotEmail('')
        setForgotOpen(false)
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message
      toast.error(serverMsg || 'Could not request password reset')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: branded panel with logo on white badge */}
        <div className="hidden md:flex flex-col items-center justify-center gap-4 p-10" style={{ background: 'linear-gradient(180deg, rgba(14,30,64,1) 0%, rgba(18,41,84,1) 100%)' }}>
          <div className="rounded-md bg-white p-4 drop-shadow-lg">
            <img src="/images/logo.png" alt="Logo" className="w-36 h-auto object-contain" />
          </div>

          <h3 className="text-xl font-semibold text-white">Rock Bridge</h3>
          <p className="text-sm text-indigo-200 text-center max-w-xs">Secure access portal — use your company credentials to sign in. If you forgot your password, we'll help you reset it.</p>

          <div className="mt-6 w-full max-w-xs">
            <div className="rounded-lg p-4 bg-white/5 border border-white/6">
              <p className="text-xs text-indigo-200">Quick tips</p>
              <ul className="mt-2 text-sm text-white/80 space-y-1 list-disc list-inside">
                <li>Use the email you registered with</li>
                <li>Passwords must be at least 6 characters</li>
                <li>Contact admin if access problems persist</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: form panel */}
        <div className="bg-white p-8 md:p-12 flex items-center">
          <div className="w-full">
            <div className="flex items-center gap-3 mb-6 md:hidden">
              <div className="rounded-md bg-white p-2">
                <img src="/images/logo.png" alt="Logo" className="w-12 h-auto" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Rock Bridge</h3>
                <p className="text-sm text-gray-500">Sign in to continue</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome back</h2>
            <p className="text-sm text-gray-500 mb-6">Sign in to access your dashboard</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="text-sm text-gray-600 flex items-center gap-2"><FaEnvelope /> Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 block w-full rounded-lg border border-gray-200 bg-gray-50 p-3 focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                  required
                />
              </label>

              <label className="block relative">
                <span className="text-sm text-gray-600 flex items-center gap-2"><FaLock /> Password</span>
                <div className="mt-2 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 pr-12 focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white border"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </label>

              <div className="flex items-center justify-between">
                <div />
                <button type="button" onClick={() => setForgotOpen(true)} className="text-sm text-orange-600 hover:underline flex items-center gap-2">
                  <FaQuestion /> Forgot?
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-lg shadow hover:from-orange-600 disabled:opacity-60"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaSignInAlt />}
                  <span>{loading ? 'Signing in...' : 'Sign in'}</span>
                </button>

                <button type="button" className="px-4 py-3 border rounded-lg" onClick={() => { setEmail(''); setPassword('') }}>
                  Clear
                </button>
              </div>
            </form>

            {/* small footer */}
            <div className="mt-6 text-xs text-gray-400 text-center">
              Need help? contact admin@rockbridge.local
            </div>
          </div>
        </div>
      </div>

      {/* Forgot password modal (simple) */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-medium mb-2">Reset password</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your email and we'll send a password-reset link (if that email exists).</p>

            <form onSubmit={handleForgot} className="space-y-4">
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@example.com"
                className="block w-full rounded-md border-gray-200 p-3"
                required
              />

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setForgotOpen(false)}
                  className="px-4 py-2 rounded-md border"
                  disabled={forgotLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md disabled:opacity-60"
                  disabled={forgotLoading}
                >
                  {forgotLoading ? <FaSpinner className="animate-spin" /> : <FaQuestion />}
                  <span>{forgotLoading ? 'Sending...' : 'Send reset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
