import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../context/useAuth";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";


const BlogPost = () => {

    const navigate = useNavigate();
    const { slug } = useParams();
    const auth = useAuth();
    const blogdata = auth.dataBlog;
    
    const blogpost = blogdata.find( post => post.slug === slug );
    const [idPost, setIdPost] = useState(null)
    const [contenidoPostLocal, setcontenidoPostLocal] = useState("");
    const [comentarioActual, setComentarioActual] = useState("")

    //Rellenar el local al cargar el post, la variable blogpost es la que cambia
    //y como efecto cambia el estado
    useEffect(() => {
        if(blogpost) {
            setIdPost(blogpost.id);
            setcontenidoPostLocal(blogpost.content);
            setComentarioActual("")
        }
    },[blogpost]);
    
    //Bloquear la ruta si esta no encuentra el blogpost
    if(!blogpost) {
        return <Navigate to="/blog" />;
    }
    

    const rolUser = auth.user?.rolUser;
    const mismoAutor =  blogpost.author === auth.user?.username;

    const canDelete = rolUser === "administrador" || mismoAutor;
    const canEditar = rolUser === "administrador" || rolUser === "profesor" || mismoAutor;

    const canComentar =  rolUser === "administrador" || rolUser === "profesor" || rolUser === "estudiante" || mismoAutor;

    const returnToBlog = () => {
        // En el parámetro se puede colocar (-1), que te envía a la página de atras
        navigate("/blog");
    }

    const eliminarBlogpost = (idblogpost) => {
        const blogPostActualizado = auth.dataBlog.filter(post => post.id != idblogpost);
        const postCommentsDataActualizado = auth.dataComentarios.filter(comentario => comentario.postId != idblogpost)

        auth.setdataBlog(blogPostActualizado);
        auth.setDataComentarios(postCommentsDataActualizado);
        navigate("/blog");
    }

    const editarBlogpost = (e) => {
        e.preventDefault();
        //console.log({idPost, contenidoPostLocal});
        const blogTemporal = auth.dataBlog;
        
        const nuevoBlogTemporal = blogTemporal.map(postblog => {
            if(postblog.id === idPost) {
                return {...postblog, content: contenidoPostLocal }
            }
            return postblog;
        });
        // Aquí actualizas el estado global
        auth.setdataBlog(nuevoBlogTemporal);
        auth.setmostrarEdicion(!auth.mostrarEdicion)
    }

    const agregarComentario = (e) => {
        e.preventDefault();
        //console.log([ comentarioActual ,auth.user.username]);
        if(comentarioActual === "") return;
        
        const nuevoComentario = {
            id: siguienteIdComentario,
            author: auth.user.username,
            content: comentarioActual,
        } 
        
        const comentariosActualizados = auth.dataComentarios.map(datacomentario  => {
            if(datacomentario.postId === idPost) {
                return {
                    ...datacomentario,
                    comments: [...datacomentario.comments, nuevoComentario]
                };
            }
            return datacomentario;
        })

        // Actualizar en el estado global
        auth.setDataComentarios(comentariosActualizados);

        // Limpiar input
        setComentarioActual("");
        
    }

    const siguienteIdComentario = auth.dataComentarios
    .map( comentario => (
        comentario.comments.map( (idcomentario) => (
            idcomentario.id
        ))
    ))
    .flat()
    .reduce( (ultimoid, idactual) => (
        ultimoid < idactual? idactual: ultimoid
    ), 0 ) 
    + 1
        
        
    

    return (
        <>
            <h2>{ blogpost.title }</h2> 
            
            {/* useNavigate */}
            <button onClick={returnToBlog}> Volver al blog </button>

            <p>{ blogpost.author }</p>
            {!auth.mostrarEdicion && <p>{ blogpost.content } </p> }
            { 
                auth.mostrarEdicion && 
                <form onSubmit={editarBlogpost} >
                    <textarea 
                        type="text" 
                        value={contenidoPostLocal} 
                        placeholder="Contenido" 
                        style={ {width:'350px', height:'100px'} }
                        onChange={e => setcontenidoPostLocal(e.target.value)} 
                    /> 
                    <br />
                    <button type="submit" > 
                        Guardar Edición
                    </button>
                </form>
            }

            {
                canDelete && !auth.mostrarEdicion && (
                    <button onClick={() => (eliminarBlogpost(blogpost.id))} >Eliminar Blogpost</button>
                )
            }
            {
                canEditar && (
                    <button onClick={() => (auth.setmostrarEdicion(!auth.mostrarEdicion))} > 
                        {!auth.mostrarEdicion? "Editar Blogpost":"Cancelar Edición"}
                    </button>
                )
            }
            {
                canComentar && (
                    <>
                        <hr />
                        <h2>COMENTARIOS</h2>
                        <ul>
                            {
                                auth.dataComentarios
                                    .filter(datacomentario => datacomentario.postId === idPost)
                                    .map(datacomentario => (
                                        datacomentario.comments.map(comentario => (
                                            <li key={comentario.id} >{comentario.author}:   "{comentario.content}" </li>
                                        ))
                                    ))
                            }
                        </ul>
                        <hr />
                        <form onSubmit={agregarComentario} >
                            <input 
                                type="text" 
                                placeholder="Escribe tu comentario" 
                                value={comentarioActual}
                                style={{"width":"400px"}} 
                                onChange={(e) => setComentarioActual(e.target.value)}
                            />
                            <button>Comentar</button>
                        </form>
                    </>
                )
            }
        </>
    )
}

export default BlogPost;