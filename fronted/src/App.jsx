import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { UserProvider, UserContext } from './context/UserContext';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import FormNote from "./pages/FormNote";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import NavbarComponent from "./components/Navbar";
import GameRequestForm from "./components/GameRequestForm";
import GameRequestsList from "./components/GameRequestsList";

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShowToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds
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
          <Route path="/notes" element={
            <ProtectedRoute>
              <FormNote />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 5 }}>
          <div
            id="liveToast"
            className={`toast ${showToast ? 'show' : 'hide'}`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              <strong className="me-auto">Notification</strong>
              <button type="button" className="btn-close" onClick={() => setShowToast(false)}></button>
            </div>
            <div className="toast-body">
              {toastMessage}
            </div>
          </div>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
