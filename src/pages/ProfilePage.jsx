import { useState } from "react";
import useAuth from "../context/useAuth";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const canAgregarUsuario = auth.user?.rolUser === "administrador" || auth.user?.rolUser === "profesor";
    const [mostrarformAddUser, setMostrarformAddUser] = useState(false);
    const [nombreNuevoUsuario, setNombreNuevoUsuario] = useState("")
    const [rolNuevoUsuario, setRolNuevoUsuario] = useState("")
    const [opcionesRolUsuario] = useState(["administrador","profesor","estudiante"])
    
    const agregarNuevoUsuario = (e) => {
        e.preventDefault();

        if(!nombreNuevoUsuario || !rolNuevoUsuario ) return;

        const nuevoIdUser = auth.nuevoIdData(auth.listausuarios);

        const nuevoNombreUser = nombreNuevoUsuario
            .normalize("NFD")
            .trim()
            .replaceAll(" ","-")
            .replaceAll("?","")
            .replaceAll("¿","")
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        const existeUsuario = auth.listausuarios.find( (usuario) => usuario.nombre === nuevoNombreUser )
        //Verifica si existe el usuaario
        if(existeUsuario) return;
        
        const nuevoUsuario = {
            id: nuevoIdUser,
            nombre: nuevoNombreUser,
            rol: rolNuevoUsuario,
        } 
        
        const userListActualizado = [
            ...auth.listausuarios, nuevoUsuario
        ]
        
        auth.setListaUsuarios(userListActualizado);
        setNombreNuevoUsuario("");
        setRolNuevoUsuario("");
        setMostrarformAddUser(false);
        navigate(`/profile/${nuevoNombreUser}`);
    }



    return (
        <>
            <h1>Perfil</h1>
            <p>Bienvenido, {auth.user.username}</p>
            <p>Su rol es: {auth.user.rolUser}</p>
            
            {
                canAgregarUsuario && 
                <button onClick={() => setMostrarformAddUser(!mostrarformAddUser)} >
                    {mostrarformAddUser?"Cancelar":"Agregar Usuario +"}
                </button>
            }
            {
                mostrarformAddUser &&
                <form onSubmit={agregarNuevoUsuario} >
                    <label>Nombre de Usuario:</label>
                    <input 
                        type="text" 
                        value={nombreNuevoUsuario}
                        placeholder="Nombre de usuario" 
                        onChange={ (e) => setNombreNuevoUsuario(e.target.value) }
                    />
                    <br />
                    <label>Rol de Usuario:</label>
                    <br />
                    <select value={rolNuevoUsuario} onChange={ (e) => setRolNuevoUsuario(e.target.value) } >
                        <option value="" key={0} >Selecciona una opción ...</option>
                        {   
                            opcionesRolUsuario.map( (opcionrol, index) => (
                                <option value={opcionrol} key={index} >{opcionrol}</option>
                            )  )
                        }
                    </select>
                    <br />
                    <button>Guardar Usuario</button>
                </form>
            }
            <h3>Listado de usuarios</h3>
            <ul>
                {
                    //Crear un listado de links
                    auth.listausuarios.map( (usuario,index) => (
                        <li key={index}>
                            <UserLink usuario={usuario} />
                        </li>
                    ))
                }
            </ul>

            <Outlet />
        </>
    )
}

function UserLink( {usuario} ) {
    const auth = useAuth();
    return(
        <>
            <Link to={`/profile/${usuario.nombre}`} onClick={() => auth.setMostrarEdicionUser(false) }  >{usuario.nombre}</Link>
        </>
    )
}

export default ProfilePage;