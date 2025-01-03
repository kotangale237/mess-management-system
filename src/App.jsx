import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import LoginForm from './components/Auth/LoginForm'
import SignupForm from './components/Auth/SignupForm'
import ComplaintForm from './components/Complaint/ComplaintForm'
import FeedbackForm from './components/Feedback/FeedbackForm'
import ComplaintList from './components/Complaint/ComplaintList'
import FeedbackList from './components/Feedback/FeedbackList'
import MealHistory from './components/Dashboard/MealHistory'
import QRCodeScanner from './components/QRCodeScanner'
import NotFound from './components/NotFound'
import UserProfile from './components/Dashboard/UserProfile'


const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/user-profile', element: <UserProfile /> },
  { path: '/login', element: <LoginForm /> },
  { path: '/signup', element: <SignupForm /> },
  { path: '/complaints', element: <ComplaintList /> },
  { path: '/feedbacks', element: <FeedbackList /> },
  { path: '/complaint-form', element: <ComplaintForm /> },
  { path: '/feedback-form', element: <FeedbackForm /> },
  { path: '/meal-history', element: <MealHistory /> },
  { path: '/qr-scanner', element: <QRCodeScanner /> },
  // { path: '/qr-code', element: <QRCodeScanner /> },
  { path:'*', element:<NotFound /> }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App