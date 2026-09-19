import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){
    let token = localStorage.getItem("access_token");
    if (!token){
        return <Navigate to="/login"/>;
    }
    return children;
}
