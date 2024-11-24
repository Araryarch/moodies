import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

// Setup Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Auth = () => {
  const { type } = useParams() // 'signin' or 'signup'
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('') // New field for full name
  const [error, setError] = useState<string | null>(null) // type error as string or null
  const [loading, setLoading] = useState(false)
  const [checkingUser, setCheckingUser] = useState(true) // Flag to prevent redirection before checking user
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false) // Flag to show confirmation message after signup
  const [userName, setUserName] = useState<string | null>(null) // Store logged-in user's name
  const [jwtToken, setJwtToken] = useState<string | null>(null) // Store JWT token

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser() // Getting current user

        // Redirect only after user is checked
        if (user) {
          // Fetch the user's profile if logged in
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single()

          if (profile) {
            setUserName(profile.full_name) // Store the user's name
          }

          if (user.email_confirmed_at) {
            navigate('/') // Redirect to homepage if email is confirmed
          } else {
            setShowConfirmationMessage(true)
          }
        } else {
          setCheckingUser(false) // Mark as done checking user
        }
      } catch {
        setCheckingUser(false) // In case of error, mark as done checking user
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

        // After sign-up, insert user data into 'profiles' table
        if (response?.data?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .insert([{ id: response.data.user.id, email, full_name: fullName }])

          if (error) {
            setError(error.message)
          } else {
            console.log('User profile created:', data)
          }
        }

        // Set show confirmation message after successful signup
        setShowConfirmationMessage(true)
      }

      if (response?.error) {
        setError(response.error.message)
      } else {
        // After successful login/signup, get session and extract JWT token
        const session = await supabase.auth.getSession()
        const token = session.data?.session?.access_token // Get the JWT token

        if (token) {
          setJwtToken(token) // Save JWT token in state
          console.log('JWT Token:', token) // You can use this token in your API requests
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

  // Function to use JWT for making authenticated requests
  const fetchDataWithJWT = async () => {
    if (!jwtToken) {
      setError('No JWT token available')
      return
    }

    try {
      const response = await fetch('https://api.example.com/protected', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}` // Send JWT in Authorization header
        }
      })

      const data = await response.json()
      console.log('Fetched data:', data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  if (checkingUser) {
    // Render a loading state or nothing while checking the user status
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

          {/* Show error if any */}
          {error && !showConfirmationMessage && (
            <div className='mb-4 text-sm text-red-500'>{error}</div>
          )}

          {/* Show confirmation message if signup is successful */}
          {showConfirmationMessage && (
            <div className='mb-4 text-sm text-green-500'>
              Please check your inbox for the confirmation email to verify your
              email address.
            </div>
          )}

          {/* Show welcome message if the user is logged in */}
          {userName && !showConfirmationMessage && (
            <div className='mb-4 text-sm text-green-500'>
              Welcome, {userName}!
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-400'
          >
            {loading ? 'Loading...' : type === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {jwtToken && !showConfirmationMessage && (
          <button
            onClick={fetchDataWithJWT}
            className='w-full px-4 py-2 mt-4 font-semibold text-white bg-green-500 rounded-md hover:bg-green-600'
          >
            Fetch Protected Data
          </button>
        )}
      </div>
    </div>
  )
}

export default Auth
