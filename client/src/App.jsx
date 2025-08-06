import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Dashboard from './pages/Admin/Dashboard'
import ManageUsers from './pages/Admin/ManageUsers'
import CreateTask from './pages/Admin/CreateTask'
import ManageTasks from './pages/Admin/ManageTasks'
import MyTask from './pages/User/MyTask'
import UserDashboard from './pages/User/UserDashboard'
import ViewTaskDetails from './pages/User/ViewTaskDetails'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path='/' element={<Navigate to="/login" replace />} />
          
          {/* Auth Routes */}
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<SignUp/>}/>

          {/* Admin Routes */}
          <Route element={<PrivateRoute allowedRoles={["admin"]}/>}>
            <Route path='/admin/dashboard' element={<Dashboard/>}/>
            <Route path='/admin/tasks' element={<ManageTasks/>}/>
            <Route path='/admin/create-task' element={<CreateTask/>}/>
            <Route path='/admin/users' element={<ManageUsers/>}/>
          </Route>
          
          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={["user"]}/>}>
            <Route path='/user/dashboard' element={<UserDashboard/>}/>
            <Route path='/user/my-tasks' element={<MyTask/>}/>
            <Route path='/user/task-details/:id' element={<ViewTaskDetails/>}/>
          </Route>

          {/* Catch all route */}
          <Route path='*' element={<Navigate to="/login" replace />} />

        </Routes>

      </BrowserRouter>

    </>
  )
}

export default App
