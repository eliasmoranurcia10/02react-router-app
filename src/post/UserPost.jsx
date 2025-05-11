import { useParams } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserPost = () => {

    const { slug } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();

    const userdata = auth.listausuarios;
    const userpost = userdata.find( post => post.nombre === slug);
    
    const [contenidoNameUser, setContenidoNameUser] = useState("");
    const [contenidoRolUser, setContenidoRolUser] = useState("");
    const [opcionesRolUsuario] = useState(["administrador","profesor","estudiante"])

    const canEditarUser = auth.user?.rolUser === "administrador" || auth.user?.username === userpost?.nombre
    const canCambiarRol = auth.user?.rolUser === "administrador";
    const canEliminarUser = (auth.user?.rolUser === "administrador" || auth.user?.username === userpost?.nombre )&& userpost?.rol != "administrador";
    
    useEffect(() =>{
        setContenidoNameUser(userpost?.nombre)
        setContenidoRolUser(userpost?.rol)
    },[userpost]);

    if(!userpost) {
        return(
            <h1>Usuario Externo</h1>
        )
    }

    const editarUsuario = (e) => {
        e.preventDefault();
        
        const listaUsuarioTemporal = auth.listausuarios.map( (usuario) => {
            if(usuario.id === userpost.id) {
                return { ...usuario, nombre: contenidoNameUser, rol: contenidoRolUser }
            }
            return usuario;
        })

        auth.setListaUsuarios(listaUsuarioTemporal);
        auth.setMostrarEdicionUser(!auth.mostrarEdicionUser);
        //Si el usuario se modifica en su usuario
        const idusuario = userpost.id;
        if(auth.user.idUser === userpost.id) {
            auth.setUser({ idUser: idusuario, username: contenidoNameUser, rolUser: contenidoRolUser});
            //auth.login({username: contenidoNameUser});
        }

        navigate(`/profile/${contenidoNameUser}`)
    }

    const eliminarUsuario = () => {
        const listaUsuariosActualizado = auth.listausuarios.filter( (usuario) => usuario.id != userpost.id )

        auth.setListaUsuarios(listaUsuariosActualizado);

        if(auth.user.idUser === userpost.id) {
            return auth.logout();
        }
        navigate(`/profile/${auth.user.username}`)
    }

    return (
        <>
            { 
                !auth.mostrarEdicionUser && (
                <div>
                    <h2>Estas viendo el perfil de {userpost.nombre} </h2>
                    <h3>Rol: {userpost.rol}</h3>
                </div>
                )
            }
            { 
                auth.mostrarEdicionUser && (
                <form onSubmit={editarUsuario} >
                    <label>Nombre de Usuario:</label>
                    <input 
                        type="text" 
                        value={contenidoNameUser} 
                        placeholder="Nombre de usuario" 
                        onChange={(e) => setContenidoNameUser(e.target.value)}
                    />
                    <br />
                    {
                        canCambiarRol &&
                        <div>
                            <label>Rol de Usuario:</label>
                            <select value={contenidoRolUser} onChange={ (e) => setContenidoRolUser(e.target.value) } >
                                <option value="" key={0} >Selecciona una opción ...</option>
                                {   
                                    opcionesRolUsuario.map( (opcionrol, index) => (
                                        <option value={opcionrol} key={index} >{opcionrol}</option>
                                    )  )
                                }
                            </select>
                        </div>
                    }
                    <br />
                    <button>Guardar Edición</button>
                </form>
                )
            }
            {
                canEditarUser && 
                <button onClick={() => auth.setMostrarEdicionUser(!auth.mostrarEdicionUser) } >
                    {!auth.mostrarEdicionUser? "Editar":"Cancelar Edición"}
                </button>
            }
            {
                canEliminarUser && 
                <button onClick={() => eliminarUsuario()} >Eliminar Usuario</button>
            }

        </>
    )
}

export default UserPost;