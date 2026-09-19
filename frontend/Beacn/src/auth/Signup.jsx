import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/endpoints";

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
        <>
        <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input type="email" value={user.email} onChange={handleEmail}/>

            <label>Password</label>
            <input type="password" value={user.password} onChange={handlePassword}/>
    
            <button type="submit">Signup</button>

            <p>Already have an account </p> <Link to={"/login"}>Login</Link>
        </form>
        {error && <p>{error}</p>}
        </>
    )
}