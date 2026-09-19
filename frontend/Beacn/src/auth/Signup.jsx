import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/endpoints";
import "./Auth.css";

export default function Signup(){
    let [user, setUser] = useState({});
    let [error, setError] = useState("");

    const navigate = useNavigate();

    function handleEmail(e){
        setUser({...user, "email":e.target.value})
    }

    function handlePassword(e){
        setUser({...user, "password":e.target.value})
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const data = await signup(user.email, user.password);
            localStorage.setItem("access_token", data.access_token);
            navigate("/")
        }
        catch(err){
            setError(err.message);
        }
    }

    return(
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <img src="../public/beacn.svg" alt="Beacn" />
                    <span>Beacn</span>
                </div>

                <h1 className="auth-title">Create your account</h1>
                <p className="auth-subtitle">Start monitoring your endpoints in minutes.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <label>Email</label>
                        <input type="email" placeholder="you@example.com" value={user.email || ""} onChange={handleEmail}/>
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={user.password || ""} onChange={handlePassword}/>
                    </div>

                    <button className="auth-submit" type="submit">Sign up</button>
                </form>

                {error && <p className="auth-error">{error}</p>}

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}