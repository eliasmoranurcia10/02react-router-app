import { useState } from "react";
import useAuth from "../context/useAuth";
import { Navigate } from "react-router-dom";
//import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const LoginPage = () => {
    const auth = useAuth();
    const [username, setUsername] = useState('');
    //const navigate = useNavigate();
    const location = useLocation();
    //const from = location.state?.from || "/";

    const login = (e) => {
        e.preventDefault();
        auth.login({username});
    }

    if(auth.user) {
        //return <Navigate to="/profile" />
        //navigate(from, { replace: true });
        return <Navigate to="/profile" state={{from:location}} replace />;
    }

    return (
        <>
            <h1>Login</h1>

            <form onSubmit={login} >
                <label>Escribe tu nombre de usuario:</label>
                <input
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                />
                <button type="submit">Entrar</button>
            </form>
        </>
    )
}

export default LoginPage;