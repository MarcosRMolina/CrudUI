import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import axios from "axios"

export function show_alerta(mensaje, icono, foco=''){

    onFocus(foco)
    const MySwal = withReactContent(Swal)
    MySwal.fire({
        title:mensaje,
        icon:icono
    })
}

function onFocus(foco){
    if(foco !== ""){
        document.getElementById(foco).focus()

    }
}



// export const sendReq = async (method, params) => {

//     const url="http://localhost:3000/componentes"

//     await axios({ method: method, url: url, data:params}).then(function(resp){
//         let type = resp.data[0]
//         let msg = resp.data[1]
//         show_alerta(msg,type);
//         if(type==="success"){
//             document.getElementById("btnCerrar").click()
//             getProducts()
//         }
        
//     })

//     .catch(function(error){
//         show_alerta("Error en la solicitud", "error")
//         console.log(error)
//     })
// }



//La intencion de este archivo es que en solo lugar tengamos todas las funciones que vamos a necesitar
//y las importemos acorde a nuestras necesidades