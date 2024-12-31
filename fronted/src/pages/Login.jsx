import React from "react";
import Form from "../components/Form";
import { Link } from "react-router-dom";

function Login({ handleShowToast }) {
    return (
        <div className="container text-center mt-5">

            <Form route="/api/auth/token/" method="login" handleShowToast={handleShowToast} />
            <p className="mt-3">
                ¿No tienes una cuenta? <Link to="/register">Crea una aquí</Link>
            </p>
        </div>
    );
}

export default Login;
