import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { Navigate } from "react-router-dom";
import { UserList } from "../data/UserList";
import { blogdata } from "../data/BlogData";
import { CommentsData } from "../data/CommentsData";
import { useLocation } from "react-router-dom";

//Creando el contexto
const AuthContext = createContext();

function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [dataBlog, setdataBlog] = useState(blogdata);

    const [mostrarEdicion, setmostrarEdicion] = useState(false);
    const [mostrarEdicionUser, setMostrarEdicionUser] = useState(false);

    const [dataComentarios, setDataComentarios] = useState(CommentsData);

    const [listausuarios, setListaUsuarios] = useState(UserList);
    
    //let location = useLocation();
    //const from = location.state?.from || "/";


    const login = ({username}) => {
        //const isAdmin = adminList.find(admin => admin===username)
        const rolUser = listausuarios.find(user => user.nombre===username)?.rol;
        const idUser = listausuarios.find(user => user.nombre===username)?.id;
        //setUser({username, isAdmin});
        
        setUser({idUser,username, rolUser});
        
        navigate(`/profile/${username}`);
        //navigate(from, { replace: true })
    };
    const logout = () => {
        setUser(null);
        navigate('/');
    };

    const nuevoIdData = (data) => {
        return data.map( post => post.id ).reduce( (ultimoid, idactual) => ( ultimoid<idactual?idactual:ultimoid ), 0 ) + 1
    }


    const auth = { 
        user, setUser, login, logout, 
        dataBlog, setdataBlog, 
        mostrarEdicion, setmostrarEdicion,
        dataComentarios, setDataComentarios,
        listausuarios, setListaUsuarios,
        mostrarEdicionUser, setMostrarEdicionUser,
        nuevoIdData
    };

    return (
        <AuthContext.Provider value={auth} >
            {children}
        </AuthContext.Provider>
    ) 
}
//Es tipo Layout: Presenta una redirección si el usuario no se encuentra logeado
function AuthRoute(props) {
    const auth = useAuth();
    //useLocation me guarda la ruta que ingresé cuando ún no estaba logeado,
    // y a la hora de logearme, me redirige a la ruta que ingresé
    let location = useLocation();

    //console.log(location);
    

    if(!auth.user) {
        return <Navigate to="/login" state={{from:location}} replace />;
    }

    return props.children;
}

export {
    AuthProvider,
    AuthContext,
    AuthRoute
};
