import * as React from 'react'
import * as ReactDom from 'react-dom/client'
import App from './App.jsx'
// import './index.css'
import Main from './mainContent.jsx';
import FormPage from './form.jsx';
import Header from './header.jsx';
// import { Root } from './App.jsx';
import Math from './mathematics.jsx';
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import { Error } from './error.jsx';
const router = createBrowserRouter([
  {
    path:'/',
    element: <App />,
    errorElement: <Error />,
    children:[
      {
        index: true,
        element: <Main />
      },
        {
          path:'user/:userId',
          element: <Main />
        }
      
    ]
  }, 
   {
    path:'/math',
    element: <Math />,
   }, 
   {
    path: '/register',
    element: <FormPage />
   }
])

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
