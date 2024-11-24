import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { useAuthStore } from '../../lib/jwtToken'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Auth = () => {
  const { type } = useParams()
  const navigate = useNavigate()

  const { setJwtToken } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [checkingUser, setCheckingUser] = useState(true)
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

          if (profile) {
            setUserName(profile.full_name)
          }

          if (user.email_confirmed_at) {
            navigate('/')
          } else {
            setShowConfirmationMessage(true)
          }
        } else {
          setCheckingUser(false)
        }
      } catch {
        setCheckingUser(false)
        setError('An error occurred while checking user status.')
      }
    }

    checkUser()
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let response

      if (type === 'signin') {
        response = await supabase.auth.signInWithPassword({ email, password })
      } else if (type === 'signup') {
        response = await supabase.auth.signUp({ email, password })

        if (response?.data?.user) {
          const { error } = await supabase
            .from('profiles')
            .insert([{ id: response.data.user.id, email, full_name: fullName }])

          if (error) setError(error.message)
          setShowConfirmationMessage(true)
        }
      }

      if (response?.error) {
        setError(response.error.message)
      } else {
        const session = await supabase.auth.getSession()
        const token = session.data?.session?.access_token

        if (token) {
          setJwtToken(token)
          console.log('JWT Token:', token)
        }

        setLoading(false)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const session = await supabase.auth.getSession()

      if (session.data?.session) {
        const token = session.data.session.access_token

        if (token) {
          setJwtToken(token)
          console.log('JWT Token:', token)
        }

        // Check if the user exists in the 'profiles' table, if not, create a profile
        const user = session.data.session.user
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user?.id)
          .single()

        if (!existingProfile) {
          // If the user doesn't have a profile, create one
          const { error } = await supabase.from('profiles').insert([
            {
              id: user?.id,
              email: user?.email,
              full_name: user?.user_metadata?.full_name || 'Unknown'
            }
          ])

          if (error) {
            setError(error.message)
          }
        }

        navigate('/')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  if (checkingUser) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
        <h2 className='mb-6 text-2xl font-semibold text-center'>
          {type === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className='mb-4'>
              <label
                htmlFor='fullName'
                className='block text-sm font-medium text-gray-700'
              >
                Full Name
              </label>
              <input
                type='text'
                id='fullName'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className='w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
              />
            </div>
          )}
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {error && !showConfirmationMessage && (
            <div className='mb-4 text-sm text-red-500'>{error}</div>
          )}

          {showConfirmationMessage && (
            <div className='mb-4 text-sm text-green-500'>
              Please check your inbox for the confirmation email to verify your
              email address.
            </div>
          )}

          {userName && !showConfirmationMessage && (
            <div className='mb-4 text-sm text-green-500'>Hi, {userName}!</div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-400'
          >
            {loading ? 'Loading...' : type === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>

          <div className='mt-4 text-center'>
            <button
              type='button'
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className='w-full px-4 py-2 mt-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 disabled:bg-red-400'
            >
              {loading ? 'Loading...' : 'Login with Google'}
            </button>

            <button
              type='button'
              onClick={() => handleOAuthLogin('github')}
              disabled={loading}
              className='w-full px-4 py-2 mt-2 font-semibold text-white bg-black rounded-md hover:bg-gray-800 disabled:bg-gray-600'
            >
              {loading ? 'Loading...' : 'Login with GitHub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth
