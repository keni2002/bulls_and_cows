import React from "react";
import Form from "../components/Form";

function Login({ handleShowToast }) {
    return <Form route="/api/auth/token/" method="login" handleShowToast={handleShowToast} />;
}

export default Login;
