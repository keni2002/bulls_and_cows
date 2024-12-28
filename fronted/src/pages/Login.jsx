import Form from "../components/Form"

function Login() {
    return <Form route="/api/auth/token/" method="login" />
}

export default Login
