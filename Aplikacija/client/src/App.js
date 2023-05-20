import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import BecomeMeister from './pages/BecomeMeister'
import Posts from './pages/Posts'
import Post from './components/Post'
import CreatePost from './pages/CreatePost'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/become-a-meister",
        element: <BecomeMeister />
      },
      {
        path: "/posts",
        element: <Posts />
      },
      {
        path: "/post/:id",
        element: <Post />
      },
      {
        path: "/create-post/:id",
        element: <CreatePost />
      },
      {
        path: "/settings/:id",
        element: <CreatePost />
      },
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
    {
    path: "/become-a-meister",
    element: <BecomeMeister />
  },
  {
    path: "/posts",
    element: <Posts />
  },
  {
    path: "/post/:id",
    element: <Post />
  },
  {
    path: "/create-post/:id",
    element: <CreatePost />
  },
])

const App = () => {
  return (
    <div>
      <RouterProvider router={router}>
        <Layout />
      </RouterProvider>
    </div>
  )
}

export default App
