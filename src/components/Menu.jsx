import { NavLink } from "react-router-dom";
import useAuth from "../context/useAuth";



const Menu = () => {

    const auth = useAuth();

    const routes = [];
    routes.push({
        to: "/",
        text: "Home",
        private: false
    })
    routes.push({
        to: "/blog",
        text: "Blog",
        private: false
    })
    routes.push({
        to: `/profile/${auth.user?.username}`,
        text: "Profile",
        private: true
    })
    routes.push({
        to: "/login",
        text: "Login",
        private: false
    })
    routes.push({
        to: "/logout",
        text: "Logout",
        private: true
    })

    return (
        <>
            <nav>
                <ul>
                    {
                        routes.map( (route) => {
                            //Si la ruta es privada y el usuario no esta logeado
                            if( route.private && !auth.user ) return null; // 
                            //Si la ruta es login y el usuario esta logeado
                            if( route.to === "/login" && auth.user ) return null;
                            
                            return(
                                <li key={route.text}>
                                <NavLink
                                    to={route.to}
                                    style={ ({ isActive }) => ({
                                        color: isActive ? 'red':'blue',
                                    }) }
                                >
                                    {route.text}
                                </NavLink>
                                </li>
                            )
                        })
                    }
                    
                </ul>
                
            </nav>
        </>
    )
}



export default Menu;