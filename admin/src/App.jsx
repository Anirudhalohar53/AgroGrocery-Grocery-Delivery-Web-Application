import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import Admin from './Pages/Admin/Admin'
import AddProduct from './Components/AddProduct/AddProduct'
import ListProduct from './Components/ListProduct/ListProduct'
import Orders from './Components/Orders/Orders'
import StockManagement from './Components/StockManagement/StockManagement'
import ContactManagement from './Components/ContactManagement/ContactManagement'
import Login from './Pages/Login/Login'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute>
            <Admin/>
          </ProtectedRoute>
        }>
          <Route path='addproduct' element={<AddProduct/>}/> 
          <Route path='listproduct' element={<ListProduct/>}/>
          <Route path='list' element={<Orders/>}/>
          <Route path='stock' element={<StockManagement/>}/>
          <Route path='contacts' element={<ContactManagement/>}/>
        </Route>

        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/admin/addproduct" replace />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
