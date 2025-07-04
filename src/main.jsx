import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; //Import Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import About from './pages/About.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Account from './pages/Account.jsx';
import AssignedJournals from './pages/AssignedJournals.jsx';
import ReviewAccept from './pages/ReviewAccept.jsx';
import ReviewReject from './pages/ReviewReject.jsx';
import JournalView from './pages/JournalView.jsx';

const router=createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {path:'/',element:<About/>},
      {path:'/sign-up',element:<Register/>},
      {path:'/login',element:<Login/>},
      {path:'/account',element:<Account/>},
      {path:'/assigned-journals',element:<AssignedJournals/>},
      {path:'/review-accept/:journalId',element:<ReviewAccept/>},
      {path:'/review-reject/:journalId',element:<ReviewReject/>},
      {path:'/view-journal/:journalId',element:<JournalView/>}
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
