import React,{useEffect, useState} from 'react'
import axios from "axios"
import Swal from "sweetalert2"
import { show_alerta } from '../functions'

const ShowProducts = () => {

    const url="http://localhost:3000/componentes/"
    const [products, setProducts] = useState([])
    const [ID, setID] = useState("")
    const [NOMBRE, setNOMBRE] = useState("")
    const [PRECIO, setPRECIO] = useState("")
    const [DESCRIPCION_CORTA, setDESCRIPCION_CORTA] = useState("")
    const [CATEGORIA, setCATEGORIA] = useState("")
    const [IMG, setIMG] = useState("")
    const [STOCK, setSTOCK] = useState("")
    const [operation, setOperation] = useState(1)
    const [title, setTitle] = useState("")

    useEffect( ()=>{
        getProducts()
    },[])

    const getProducts = async () => {
        const res = await axios.get(url)
        setProducts(res.data)
    }

    const openModal = (op, ID, NOMBRE, DESCRIPCION_CORTA, PRECIO, CATEGORIA, STOCK) =>{
        setID("")
        setNOMBRE("")
        setDESCRIPCION_CORTA("")
        setPRECIO("")
        setCATEGORIA("")
        setSTOCK("")
        setOperation(op);
        if(op === 1){
            setTitle("Registrar Producto");
        }else if(op===2){
            setTitle("Editar Producto")
            setID(ID)
            setNOMBRE(NOMBRE)
            setDESCRIPCION_CORTA(DESCRIPCION_CORTA)
            setPRECIO(PRECIO)
            setCATEGORIA(CATEGORIA)
            setSTOCK(STOCK)
        }
        window.setTimeout(function(){
            document.getElementById("nombre").focus();
        },500)
    }

    const validate = () => {
      let parametro;
      let metodo;
      if (NOMBRE.trim() === "") {
        show_alerta("Escribe el nombre del componente", "warning");
      } else if (DESCRIPCION_CORTA.trim() === "") {
        show_alerta("Escribe una descripción del componente", "warning");
      } else if (PRECIO === "") {
        show_alerta("Escribe el precio del componente", "warning");
      } else if (CATEGORIA.trim() === "") {
        show_alerta("Escribe el nombre del componente", "warning");
      } else if (STOCK === "") {
        show_alerta("Escribe la disponibilidad", "warning");
      } else {
        if (operation === 1) {
          parametro = {
            NOMBRE: NOMBRE.trim(),
            DESCRIPCION_CORTA: DESCRIPCION_CORTA.trim(),
            PRECIO: PRECIO,
            CATEGORIA: CATEGORIA.trim(),
            STOCK: STOCK,
          };
          metodo = 'POST';
        } else if (operation === 2) {
          parametro = {
            ID:ID,
            NOMBRE: NOMBRE.trim(),
            DESCRIPCION_CORTA: DESCRIPCION_CORTA.trim(),
            PRECIO: PRECIO,
            CATEGORIA: CATEGORIA.trim(),
            STOCK: STOCK,
          };
          metodo = 'PATCH';
        }
      }

    sendReq(metodo, parametro);
    };
    const sendReq = async (metodo, parametro) => {

        
        await axios({ method: metodo, url:(operation === 2? `${url}${parametro.ID}` : url), data: parametro })
        .then(function (resp) {
          let type = resp.data[0];
          let msg = resp.data[1];
          show_alerta(msg, type);
          getProducts();
          if (type==="success",
            Swal.fire(
                'Producto Editado!',
                `El producto se ha editado con exito`,
                'success'
            )
            ){
                getProducts()
            }
        })

        .catch(function (error) {
          show_alerta("Error en la solicitud", "error");
         
        });
    };





    const deleteProduct = async( producto ) => {
        const response = await axios.delete(`${url}${producto.ID}`)
        if (response.status === 200,
            Swal.fire(
                'Producto Borrado!',
                `El producto ${producto.NOMBRE}se ha eliminado`,
                'success'
            )
            ){
                getProducts()
            } else {
            Swal.fire(
                'Error!',
                'Hubo un problema al eliminar el porducto',
                'error'
            );
        }
    }




    

    return (
    <div className='App'>
        <div className="container-fluid">
            <div className='row mt-3'>
                <div className="col-md-4 offset-md-4">
                    <div className="d-grid mx-auto">
                        <button onClick={()=>openModal(1)} className='btn btn-dark' data-bs-toggle="modal" data-bs-target="#modalProducts">
                            <i className='fa-solid fa-circle-plus'>Añadir</i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr> <th>#</th> <th>NOMBRE</th> <th>DESCRIPCION</th> <th>PRECIO</th> <th>CATEGORIA</th> <th>STOCK</th> </tr>
                            </thead>
                            <tbody className='table-group-devider'>
                                {products.map( (product, i)=>(
                                    <tr key={product.ID}>
                                        <td>{(i+1)}</td>
                                        <td>{product.NOMBRE}</td>
                                        <td>{product.DESCRIPCION_CORTA}</td>
                                        <td>${new Intl.NumberFormat('es-mx').format(product.PRECIO)}</td>
                                        <td>{product.CATEGORIA}</td>
                                        <td>{product.STOCK}</td>
                                        <td>
                                            <button onClick={()=>openModal(2,
                                                product.ID,
                                                product.NOMBRE,
                                                product.DESCRIPCION_CORTA,
                                                product.PRECIO,
                                                product.CATEGORIA,
                                                product.STOCK)} className='btn btn-warning' data-bs-toggle="modal" data-bs-target="#modalProducts">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            &nbsp;
                                            <button onClick={()=>deleteProduct(product)} className='btn btn-danger'>
                                                <i className='fa-solid fa-trash'></i>
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div id='modalProducts' className="modal fade" aria-hidden = "true" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <label className='h5'>{title}</label>
                        <button type='button' className='btn-close' data-bs-dismiss="modal" aria-label='Close' > </button>

                    </div>
                    <div className="modal-body">
                        <input type="hidden" id="id" ></input>
                        <div className="input-group mb-3">
                            <span className='input-gropu-text'><i class="fa-solid fa-hashtag"></i></span>
                            <input type="text" id='nombre' className='form-control' placeholder='Nombre' value={NOMBRE} onChange={(e)=>setNOMBRE(e.target.value)} ></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className='input-gropu-text'><i class="fa-solid fa-dollar-sign"></i></span>
                            <input type="text" id='precio' className='form-control' placeholder='Precio' value={PRECIO} onChange={(e)=>setPRECIO(e.target.value)} ></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className='input-gropu-text'><i class="fa-regular fa-comment-dots"></i></span>
                            <input type="text" id='descripcion_corta' className='form-control' placeholder='Descripcion' value={DESCRIPCION_CORTA} onChange={(e)=>setDESCRIPCION_CORTA(e.target.value)} ></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className='input-gropu-text'><i class="fa-solid fa-list-ol"></i></span>
                            <input type="text" id='categoria' className='form-control' placeholder='Categoria' value={CATEGORIA} onChange={(e)=>setCATEGORIA(e.target.value)} ></input>
                        </div>
                        <div className="input-group mb-3">
                            <span className='input-gropu-text'><i class="fa-solid fa-database"></i></span>
                            <input type="text" id='stock' className='form-control' placeholder='Stock' value={STOCK} onChange={(e)=>setSTOCK(e.target.value)} ></input>
                        </div>
                        <div className="d-grid col-6 mx-auto">
                            <button onClick={()=>validate()} className='btn btn-success'>
                                <i className='fa-solid fa-floppy-disk'></i> Guardar
                            </button>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type='button' id="btnCerrar" className='btn btn-secondary' data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default ShowProducts