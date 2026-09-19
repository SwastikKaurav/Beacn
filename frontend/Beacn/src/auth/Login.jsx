import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/endpoints";

export default function Login(){
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
            const data = await login(user.email, user.password);
            localStorage.setItem("access_token", data.access_token);
            navigate("/")
        }
        catch(err){
            setError(err.message);
        }
    }

    
    return(
        <>
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" value={user.email} onChange={handleEmail}/>

            <label>Password</label>
            <input type="password" value={user.password} onChange={handlePassword}/>

            <button type="submit">Login</button>

            <p>Don't have an account? </p> <Link to={"/signup"}>Sign up</Link>
        </form>
        {error && <p>{error}</p>}
        </>
    )
}