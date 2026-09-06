/* CARRITO */
// Actualiza el número que aparece junto al botón "Carrito" del navbar
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    const badge = document.querySelector(".badge-contador");
    if (badge) {
        badge.textContent = carrito.length;
    }
}

// Dibuja los productos dentro del offcanvas del carrito
function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    const contenedorCarrito = document.getElementById("contenedor-items-carrito");
    const totalElemento = document.getElementById("total-carrito");
    const btnLimpiar = document.getElementById("btn-limpiar-carrito");

    if (!contenedorCarrito || !totalElemento) return;

    contenedorCarrito.innerHTML = "";

    // Si no hay productos, se muestra el mensaje de "carrito vacío",
    // se deshabilita el botón de vaciar y se corta la función aquí
    if (carrito.length === 0) {
        const mensajeVacio = document.createElement("p");
        mensajeVacio.className = "texto-pie text-center mt-4";
        mensajeVacio.textContent = "No tienes productos en el carrito.";
        contenedorCarrito.appendChild(mensajeVacio);

        totalElemento.textContent = "$0";
        if (btnLimpiar) btnLimpiar.disabled = true;
        return;
    }

    if (btnLimpiar) btnLimpiar.disabled = false;

    let totalAcumulado = 0;

    // forEach recibe también el índice (posición) de cada elemento,
    // que se necesita para poder eliminarlo después
    carrito.forEach((producto, indice) => {
        totalAcumulado += producto.precio;

        const itemRow = document.createElement("div");
        itemRow.className = "d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary";

        const infoCol = document.createElement("div");
        infoCol.className = "d-flex align-items-center gap-2";

        const miniatura = document.createElement("img");
        miniatura.src = producto.imagen;
        miniatura.alt = producto.nombre;
        miniatura.className = "rounded";
        miniatura.style.width = "48px";
        miniatura.style.height = "48px";
        miniatura.style.objectFit = "cover";

        const textos = document.createElement("div");

        const titulo = document.createElement("h6");
        titulo.className = "mb-0 text-white small";
        titulo.textContent = producto.nombre;

        const precioTexto = document.createElement("small");
        precioTexto.className = "texto-neon-verde fw-bold";
        precioTexto.textContent = "$" + producto.precio.toLocaleString("es-CL");

        textos.appendChild(titulo);
        textos.appendChild(precioTexto);

        infoCol.appendChild(miniatura);
        infoCol.appendChild(textos);

        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn btn-sm btn-outline-danger";
        btnBorrar.innerHTML = '<i class="bi bi-x-lg"></i>';
        btnBorrar.setAttribute("aria-label", "Quitar producto");

        btnBorrar.addEventListener("click", () => {
            eliminarProductoDelCarrito(indice);
        });

        itemRow.appendChild(infoCol);
        itemRow.appendChild(btnBorrar);
        contenedorCarrito.appendChild(itemRow);
    });

    totalElemento.textContent = "$" + totalAcumulado.toLocaleString("es-CL");
}

function eliminarProductoDelCarrito(indice) {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    carrito.splice(indice, 1);
    localStorage.setItem("carritoGamer", JSON.stringify(carrito));

    actualizarContadorCarrito();
    renderizarCarrito();
}

function configurarBotonVaciar() {
    const btnLimpiar = document.getElementById("btn-limpiar-carrito");
    if (btnLimpiar) {
        btnLimpiar.addEventListener("click", () => {
            localStorage.removeItem("carritoGamer");
            actualizarContadorCarrito();
            renderizarCarrito();
        });
    }
}


//FORMULARIO CONTACTO
const formContacto = document.getElementById("form-contacto");
const campoNombre = document.getElementById("campo-nombre");
const campoCorreo = document.getElementById("campo-correo");
const campoMensaje = document.getElementById("campo-mensaje");
const contadorCaracteres = document.getElementById("contador-caracteres");
const alertaExito = document.getElementById("alerta-exito");

const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

//Funciones de validación: un mensaje de error si algo está mal, o "" vacío campo es válido
function validarNombre() {
    const valor = campoNombre.value.trim();

    if (valor === "") {
        return "El nombre es obligatorio.";
    }
    if (valor.length > 100) {
        return "El nombre no puede superar los 100 caracteres.";
    }
    return "";
}

function validarCorreo() {
    const valor = campoCorreo.value.trim();

    if (valor === "") {
        return "El correo es obligatorio.";
    }
    if (valor.length > 100) {
        return "El correo no puede superar los 100 caracteres.";
    }

    // .some() revisa si AL MENOS UNO de los dominios permitidos coincide
    // con el final del correo escrito. .endsWith() compara el final del
    // texto, así "usuario@gmail.com" sí calza pero "usuario@gmail.com.fake" no
    const tieneDominioValido = dominiosPermitidos.some(dominio => valor.endsWith(dominio));

    if (!tieneDominioValido) {
        return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
    }
    return "";
}

function validarMensaje() {
    const valor = campoMensaje.value.trim();

    if (valor === "") {
        return "El mensaje es obligatorio.";
    }
    if (valor.length > 500) {
        return "El mensaje no puede superar los 500 caracteres.";
    }
    return "";
}

//Función genérica para pintar el resultado de una validación

function mostrarResultadoValidacion(campo, idError, mensajeError) {
    const elementoError = document.getElementById(idError);

    if (mensajeError === "") {
        // Sin error: se marca en verde y se limpia el mensaje
        campo.classList.remove("is-invalid");
        campo.classList.add("is-valid");
        elementoError.textContent = "";
    } else {
        // Con error: se marca en rojo y se muestra el mensaje
        campo.classList.remove("is-valid");
        campo.classList.add("is-invalid");
        elementoError.textContent = mensajeError;
    }
}


// Validación en tiempo real: el evento "input" se dispara cada vez que el usuario escribe 

campoNombre.addEventListener("input", () => {
    mostrarResultadoValidacion(campoNombre, "error-nombre", validarNombre());
});

campoCorreo.addEventListener("input", () => {
    mostrarResultadoValidacion(campoCorreo, "error-correo", validarCorreo());
});

campoMensaje.addEventListener("input", () => {
    // Actualiza el contador "x/500 caracteres" en cada tecla
    contadorCaracteres.textContent = campoMensaje.value.length;
    mostrarResultadoValidacion(campoMensaje, "error-mensaje", validarMensaje());
});


//Envio formulario
formContacto.addEventListener("submit", (evento) => {
    // preventDefault evita que la página se recargue al enviar
    evento.preventDefault();

    //Validaciones de nuevo al enviar 
    const errorNombre = validarNombre();
    const errorCorreo = validarCorreo();
    const errorMensaje = validarMensaje();

    mostrarResultadoValidacion(campoNombre, "error-nombre", errorNombre);
    mostrarResultadoValidacion(campoCorreo, "error-correo", errorCorreo);
    mostrarResultadoValidacion(campoMensaje, "error-mensaje", errorMensaje);

    // Si cualquiera de los 3 mensajes de error no está vacío el formulario no es válido
    const formularioValido = errorNombre === "" && errorCorreo === "" && errorMensaje === "";

    if (!formularioValido) {
        alertaExito.classList.add("d-none");
        return; // corta la función aquí, no se guarda nada
    }

    //Guardar en localStorage
    const mensajesGuardados = JSON.parse(localStorage.getItem("mensajesContacto")) || [];

    mensajesGuardados.push({
        nombre: campoNombre.value.trim(),
        correo: campoCorreo.value.trim(),
        mensaje: campoMensaje.value.trim(),
        fecha: new Date().toISOString() //
    });

    localStorage.setItem("mensajesContacto", JSON.stringify(mensajesGuardados));

    // Muestra la alerta de éxito y limpia el formulario
    alertaExito.classList.remove("d-none");
    formContacto.reset();
    contadorCaracteres.textContent = "0";

    // Quita las marcas verdes/rojas de validación al vaciarse los campos
    [campoNombre, campoCorreo, campoMensaje].forEach(campo => {
        campo.classList.remove("is-valid", "is-invalid");
    });
});


configurarBotonVaciar();
actualizarContadorCarrito();
renderizarCarrito();
