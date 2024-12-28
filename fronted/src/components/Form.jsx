import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        // Reset errors
        setErrors({});

        // Password match validation
        if (method === "register" && password !== confirmPassword) {
            setErrors({ password: ["Passwords do not match"] });
            setLoading(false);
            return;
        }

        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        } catch (error) {
            // Check for error messages from backend
            if (error.response && error.response.data) {
                setErrors(error.response.data);
            } else {
                setErrors({ detail: [error.message] });
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            {errors.username && <small className="text-danger">{errors.username[0]}</small>}
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {errors.password && <small className="text-danger">{errors.password[0]}</small>}
            {method === "register" && (
                <>
                    <input
                        className="form-input"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />
                    {errors.confirmPassword && <small className="text-danger">{errors.confirmPassword[0]}</small>}
                </>
            )}
            {errors.detail && <small className="text-danger">{errors.detail}</small>}
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit" disabled={loading}>
                {name}
            </button>
        </form>
    );
}

export default Form;
