import { Link, Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BlogPage = () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const rolUser = auth.user?.rolUser;
    const canAgregarBlog =  rolUser === "administrador" || rolUser === "profesor" || rolUser === "estudiante"
    const [mostrarformAddPost, setMostrarformAddPost] = useState(false); 
    const [nuevoTitulo, setNuevoTitulo] = useState("")
    const [nuevoContenido, setNuevoContenido] = useState("")

    const agregarBlogPost = (e) => {
        e.preventDefault();

        if(!nuevoTitulo || !nuevoContenido) return;

        const nuevoIdPost = auth.nuevoIdData(auth.dataBlog);

        const nuevoSlug = nuevoTitulo
            .toLowerCase()
            .normalize("NFD")
            .trim()
            .replaceAll(" ","-")
            .replaceAll("?","")
            .replaceAll("¿","")
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        const nuevoBlogPost = {
            id: nuevoIdPost,
            title: nuevoTitulo,
            slug: nuevoSlug,
            content: nuevoContenido,
            author: auth.user?.username
        }
        //console.log(nuevoBlogPost);
        auth.setdataBlog(
            [
                ...auth.dataBlog,
                nuevoBlogPost
            ]
        )

        auth.setDataComentarios(
            [
                ...auth.dataComentarios,
                {
                    postId: nuevoIdPost,
                    comments: []
                }
            ]
        )

        setNuevoTitulo("");
        setNuevoContenido("");
        setMostrarformAddPost(false);
        navigate(`/blog/${nuevoSlug}`);
    }

    return (
        <>
            <h1>BlogPage</h1>
            {
                mostrarformAddPost && 
                <form onSubmit={agregarBlogPost}>
                    <input 
                        type="text" 
                        placeholder="Titulo" 
                        style={ {width:'350px', marginBottom:'20px'} }
                        value={nuevoTitulo}
                        onChange={(e) => setNuevoTitulo(e.target.value)}
                    />
                    <br />
                    <textarea 
                        type="text" 
                        placeholder="Contenido" 
                        style={ {width:'350px', height:'100px'} }
                        value={nuevoContenido}
                        onChange={(e) => setNuevoContenido(e.target.value)}
                    /> 
                    <br />
                    <button>Enviar Post</button>
                </form>
            }
            {
                canAgregarBlog && 
                <button onClick={() => setMostrarformAddPost(!mostrarformAddPost)} >
                    {mostrarformAddPost? "Cancelar Post":"Agregar BlogPost +"}
                </button>
            }
            <ul>
                {
                    //Crear un listado de links
                    auth.dataBlog.map( post => (
                        <li key={post.id}>
                            <BlogLink post={post} />
                        </li>
                    ))
                }
            </ul>

            <Outlet />
        </>
    )
}

function BlogLink( {post} ) {
    const auth = useAuth();
    return(
        <>
            <Link to={`/blog/${post.slug}`} onClick={() => auth.setmostrarEdicion(false)} >{post.title}</Link>
        </>
    )
}


export default BlogPage;