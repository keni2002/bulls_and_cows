import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { UserProvider, UserContext } from './context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import FormNote from "./pages/FormNote";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import NavbarComponent from "./components/Navbar";
import GameRequestForm from "./components/GameRequestForm";
import GameRequestsList from "./components/GameRequestsList";
import ReceivedRequestsList from "./components/ReceivedRequestsList"
function Logout({ handleShowToast }) {
  const { handleLogout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    handleLogout();
    handleShowToast("Logout successful!");
    navigate("/login");
  }, [handleLogout, handleShowToast, navigate]);

  return null;
}

function RegisterAndLogout() {
  const { handleLogout } = useContext(UserContext);
  handleLogout();
  return <Register />;
}

function App() {
  const handleShowToast = (message) => {
    toast(message);
  };

  return (
    <UserProvider>
      <BrowserRouter>
        <NavbarComponent handleShowToast={handleShowToast} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login handleShowToast={handleShowToast} />} />
          <Route path="/logout" element={<Logout handleShowToast={handleShowToast} />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/game-requests" element={
            <ProtectedRoute>
              <GameRequestForm handleShowToast={handleShowToast} />
            </ProtectedRoute>
          }/>
          <Route path="/requests" element={
            <ProtectedRoute>
              <GameRequestsList handleShowToast={handleShowToast} />
            </ProtectedRoute>
          }/>
          <Route path="/received-requests" element={
            <ProtectedRoute> <ReceivedRequestsList handleShowToast={handleShowToast} />
            </ProtectedRoute>
          }/>
          <Route path="/notes" element={
            <ProtectedRoute>
              <FormNote />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
