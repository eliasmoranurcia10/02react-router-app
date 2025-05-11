import { useContext } from "react";
import { AuthContext } from "./Auth";

//Utilizando el contexto
const useAuth = () => {
    const auth = useContext(AuthContext);
    return auth;
}

export default useAuth;