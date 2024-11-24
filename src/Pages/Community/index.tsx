import React, { useState, useEffect, useCallback } from 'react'
import { createClient, User } from '@supabase/supabase-js'
import Navbar from '../../components/ui/Navbar'
import Footer from '../../components/ui/Footer'

// Interface definitions
interface Post {
  id: number
  text: string
  sender: string
  timestamp: string
  image_url?: string
}

interface AlertProps {
  message: string
  type: 'success' | 'error'
}

// interface UserMetadata {
//   username: string
// }

// Initialize Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Alert Component
const Alert: React.FC<AlertProps> = ({ message, type }) => (
  <div
    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
      type === 'success'
        ? 'bg-primary text-primary-foreground'
        : 'bg-destructive text-destructive-foreground'
    }`}
  >
    {message}
  </div>
)

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className='w-5 h-5 border-2 rounded-full border-primary animate-spin border-t-transparent' />
)

const Community = () => {
  // State management
  const [posts, setPosts] = useState<Post[]>([])
  const [newText, setNewText] = useState<string>('')
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [alert, setAlert] = useState<AlertProps | null>(null)
  const [editingPost, setEditingPost] = useState<Post | null>(null) // For editing posts
  const [user, setUser] = useState<User | null>(null) // Store user info if logged in
  const [username, setUsername] = useState<string>('') // Store username from the profiles table

  // Show alert helper
  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 3000)
  }

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('timestamp', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (err) {
      showAlert(`Failed to load posts: ${err}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user', error)
      } else {
        setUser(data.user)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchUsername = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching username', error)
        } else if (data) {
          setUsername(data.full_name || 'anonymous')
        }
      }
    }

    if (user) {
      fetchUsername()
    }
  }, [user])

  const clearImage = () => {
    setImage(null)
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage
      .from('images')
      .upload(fileName, file)

    if (error) throw error
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
    return urlData?.publicUrl || null
  }

  const addPost = async () => {
    if (!newText.trim() && !image) {
      showAlert('Please add some text or an image', 'error')
      return
    }

    setIsLoading(true)
    try {
      let imageUrl: string | null = null
      if (image) {
        imageUrl = await uploadImage(image)
      }

      const sender = username || 'anonymous'

      const post = {
        text: newText.trim(),
        sender: sender,
        timestamp: new Date().toISOString(),
        image_url: imageUrl
      }

      const { data, error } = await supabase.from('posts').insert([post])
      if (error) throw error

      setPosts([...(data || []), ...posts])
      setNewText('')
      clearImage()
      showAlert('Post created successfully!', 'success')
    } catch (err) {
      showAlert(`Failed to create post: ${err}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Edit post
  const editPost = (post: Post) => {
    setEditingPost(post)
    setNewText(post.text)
    if (post.image_url) {
      // Handle image preview if post has an image
      setImage(null) // Reset image input when editing (optional)
    }
  }

  const updatePost = async () => {
    if (!newText.trim() && !image) {
      showAlert('Please add some text or an image', 'error')
      return
    }

    setIsLoading(true)
    try {
      let imageUrl: string | null = null
      if (image) {
        imageUrl = await uploadImage(image)
      }

      // Use the username from the profiles table
      const sender = username || 'anonymous'

      const updatedPost = {
        text: newText.trim(),
        sender: sender,
        timestamp: new Date().toISOString(),
        image_url: imageUrl || editingPost?.image_url
      }

      const { error } = await supabase
        .from('posts')
        .update(updatedPost)
        .eq('id', editingPost?.id)

      if (error) throw error

      setPosts(
        posts.map((post) =>
          post.id === editingPost?.id ? { ...post, ...updatedPost } : post
        )
      )
      setEditingPost(null)
      setNewText('')
      clearImage()
      showAlert('Post updated successfully!', 'success')
    } catch (err) {
      showAlert(`Failed to update post: ${err}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Delete post
  const deletePost = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error

      setPosts(posts.filter((post) => post.id !== id))
      showAlert('Post deleted successfully!', 'success')
    } catch {
      showAlert('Failed to delete post', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts]) // Dependency array now contains `fetchPosts`, which is stable

  return (
    <main className='w-full min-h-screen bg-background text-foreground'>
      <Navbar />
      <div className='flex flex-col min-h-screen pt-24'>
        {alert && <Alert {...alert} />}

        <div className='flex-1 p-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post) => (
              <div
                key={post.id}
                className='p-4 transition duration-300 rounded-lg shadow-lg bg-card text-card-foreground'
              >
                <div className='font-semibold'>{post.sender}</div>
                <div className='text-sm text-secondary-foreground'>
                  {new Date(post.timestamp).toLocaleString()}
                </div>
                <div className='mt-4'>{post.text}</div>
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt='Post Image'
                    className='object-cover w-full h-64 mt-4 rounded-lg'
                  />
                )}
                <div className='flex justify-between mt-4'>
                  <button
                    onClick={() => editPost(post)}
                    className='text-primary hover:text-primary-foreground'
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className='text-destructive hover:text-destructive-foreground'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='p-6 border-t border-secondary bg-secondary'>
          <div className='max-w-2xl mx-auto'>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder='Write a post...'
              className='w-full h-24 p-4 border rounded-lg text-foreground bg-input focus:outline-none focus:ring-2 focus:ring-ring'
            />
            <div className='mt-4'>
              <button
                onClick={editingPost ? updatePost : addPost}
                disabled={isLoading}
                className={`w-full px-6 py-3 text-white rounded-lg ${
                  isLoading
                    ? 'bg-muted'
                    : 'bg-primary hover:bg-primary-foreground'
                }`}
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : editingPost ? (
                  'Update Post'
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Community
