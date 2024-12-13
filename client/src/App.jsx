import { useEffect } from "react"
// import "./App.css"
// Redux
import { useDispatch, useSelector } from "react-redux"
// React Router
import { Route, Routes, useNavigate } from "react-router-dom"

// Components
import OpenRoute from "./component/Auth/OpenRoute"
import PrivateRoute from "./component/Auth/PrivateRoute"

// Pages
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import VerifyEmail from "./pages/VerifyEmail"
import Error from "./pages/Error"
// import getUserDetails from "./services/operations/profileAPI"
import Dashboard from "./pages/Dashbaord"
import Debit from "./component/Wallet/debit"
import Deposit from "./component/Wallet/deposit"
import Transfer from "./component/Wallet/transfer"
import Transactions from "./component/Wallet/history"

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      // dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <VerifyEmail />
            </OpenRoute>
          }
        />
        {/* Private Route - for Only Logged in User */}
        <Route
        path="dashboard"
          element={
            <PrivateRoute>
            <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
        path="debit"
          element={
            <PrivateRoute>
            <Debit />
            </PrivateRoute>
          }
        />
        <Route
        path="deposit"
          element={
            <PrivateRoute>
            <Deposit />
            </PrivateRoute>
          }
        />
        <Route
        path="transfer"
          element={
            <PrivateRoute>
            <Transfer />
            </PrivateRoute>
          }
        />
        <Route
        path="transactions"
          element={
            <PrivateRoute>
            <Transactions />
            </PrivateRoute>
          }
        />
          

        {/* 404 Page */}
        <Route path="*" element={<Error />} /> 
      </Routes>
    </div>
  )
}

export default App
