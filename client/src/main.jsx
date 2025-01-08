import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NewUser from './components/signup.jsx'
import LogIn from './components/login.jsx'
import Folder from './components/folder.jsx'
import Dashboard from './components/dashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/:id',
    element: < Dashboard />
  },
  {
    path: '/folder',
    element: < Folder />
  },
  {
    path: '/sign-up',
    element: < NewUser />
  },
  {
    path: '/login',
    element: < LogIn />
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    < RouterProvider router={router}  />
  </StrictMode>,
)
