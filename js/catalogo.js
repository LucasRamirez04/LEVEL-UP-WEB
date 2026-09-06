/* Obtener productos */
/* Busca en localstorage si se creo en index.js */
const inventarioProductos = [
    {
        codigo: "JM001",
        categoria: "Juegos de Mesa",
        nombre: "Catan",
        precio: 29000,
        enOferta: true,
        descuento: 30,
        imagen: "img/catan.jpg"
    },
    {
        codigo: "JM002",
        categoria: "Juegos de Mesa",
        nombre: "Carcassonne",
        precio: 24990,
        enOferta: false,
        descuento: 0,
        imagen: "img/carcassonne.jpg"
    },
    {
        codigo: "AC001",
        categoria: "Accesorios",
        nombre: "Controlador Inalámbrico Xbox Series X",
        precio: 59990,
        enOferta: true,
        descuento: 15,
        imagen: "img/control-xbox.webp"
    },
    {
        codigo: "AC002",
        categoria: "Accesorios",
        nombre: "Auriculares Gamer HyperX Cloud II",
        precio: 79990,
        enOferta: false,
        descuento: 20,
        imagen: "img/audifonos-hyperx.jpg"
    },
    {
        codigo: "CO001",
        categoria: "Consolas/Computadores",
        nombre: "PlayStation5",
        precio: 549990,
        enOferta: false,
        descuento: 0,
        imagen: "img/play5.jpg"
    },
    {
        codigo: "CO002",
        categoria: "Consolas/Computadores",
        nombre: "PC Gamer ASUS ROG Strix",
        precio: 1299990,
        enOferta: true,
        descuento: 15,
        imagen: "img/asus-rog.png"
    },
    {
        codigo: "PE001",
        categoria: "Perifericos",
        nombre: "Silla Gamer Secretlab Titan",
        precio: 349990,
        enOferta: false,
        descuento: 0,
        imagen: "img/sillagamer3.jpg"
    },
    {
        codigo: "PE002",
        categoria: "Perifericos",
        nombre: "Mouse Gamer Logitech G502 HERO",
        precio: 49990,
        enOferta: true,
        descuento: 5,
        imagen: "img/g502.webp"
    },
    {
        codigo: "PE003",
        categoria: "Perifericos",
        nombre: "Mousepad Razer Goliathus Extended Chroma",
        precio: 29990,
        enOferta: false,
        descuento: 0,
        imagen: "img/mousepad.webp"
    },
    {
        codigo: "VE001",
        categoria: "Vestuario",
        nombre: "Polera Gamer Personalizada 'Level-Up'",
        precio: 14990,
        enOferta: false,
        descuento: 0,
        imagen: "img/polera.jpg"
    }
];

// Si la clave "productos" no existe todavía en localStorage, la creamos.
if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(inventarioProductos));
}

// texto a javascript para poder filtrar y buscar
const productos = JSON.parse(localStorage.getItem("productos")) || [];

/* Utilidades */
function formatearPrecio(valor) {
    return "$" + valor.toLocaleString("es-CL");
}

function calcularPrecioFinal(producto) {
    return Math.round(producto.precio * (1 - producto.descuento / 100));
}

/* Grid productos */
function renderizarProductos(lista) {
    const grid = document.getElementById("grid-productos");

    // innerHTML = "" borra todo lo que había antes de volver a dibujar
    // (evita que se dupliquen tarjetas si se llama la función más de una
    // vez, por ejemplo cada vez que se cambia el filtro)
    grid.innerHTML = "";

    lista.forEach((producto) => {
        // Tarjeta contenedora
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-producto";
        // dataset.codigo guarda el código del producto directo en el HTML,
        // así no hay que buscarlo de nuevo cuando se hace click
        tarjeta.dataset.codigo = producto.codigo;

        // Imagen del producto
        const imagen = document.createElement("img");
        imagen.className = "imagen-producto";
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;

        // Insignia de descuento flotante
        const badge = document.createElement("span");
        badge.className = "badge position-absolute top-0 end-0 m-2 px-2 py-1";
        badge.style.backgroundColor = "#39FF14";
        badge.style.color = "#000000";
        badge.style.fontWeight = "bold";
        badge.textContent = `-${producto.descuento}% OFF`;

        // Nombre del producto
        const nombre = document.createElement("p");
        nombre.className = "nombre-producto";
        nombre.textContent = producto.nombre;

        // Precio: si el producto está en oferta, se calcula el precio
        // final con el descuento aplicado; si no, se muestra el precio normal
        const precio = document.createElement("p");
        precio.className = "precio-producto";
        const precioMostrado = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;
        precio.textContent = formatearPrecio(precioMostrado);

        // Botón para añadir directo desde la tarjeta (sin abrir el detalle)
        const botonAgregar = document.createElement("button");
        botonAgregar.type = "button";
        botonAgregar.className = "btn boton-agregar-carrito";
        botonAgregar.textContent = "Añadir";

        // stopPropagation evita que el click en el botón también dispare
        // el evento de click de la tarjeta completa (que abre el modal)
        botonAgregar.addEventListener("click", (evento) => {
            evento.stopPropagation();
            agregarAlCarrito(producto.codigo, 1);
        });

        // Click en cualquier parte de la tarjeta (menos el botón) abre el detalle
        tarjeta.addEventListener("click", () => {
            abrirDetalleProducto(producto.codigo);
        });

        // Ensamblado: se van agregando los elementos hijos a la tarjeta,
        // y la tarjeta al grid
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(nombre);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(botonAgregar);
        tarjeta.appendChild(badge);

        grid.appendChild(tarjeta);
    });
}

/* Filtro por categoria */
function aplicarFiltro() {
    // .value trae la opción seleccionada actualmente en el <select>
    const categoria = document.getElementById("filtro-categoria").value;

    if (categoria === "todas") {
        renderizarProductos(productos);
    } else {
        // .filter recorre el arreglo completo y devuelve solo los productos
        // cuya categoría coincide exactamente con la seleccionada
        const filtrados = productos.filter(p => p.categoria === categoria);
        renderizarProductos(filtrados);
    }
}

/* Modal detalle producto */

// Guarda qué producto está mostrando el modal en este momento,
// para saber cuál agregar cuando se apriete "Añadir al carrito"
let codigoProductoActivo = null;

function abrirDetalleProducto(codigo) {
    // .find busca en el arreglo el primer producto cuyo código coincida
    const producto = productos.find(p => p.codigo === codigo);
    if (!producto) return; // si no lo encuentra, no hace nada (seguridad)

    codigoProductoActivo = codigo;

    // .textContent cambia el texto visible; .src cambia la imagen mostrada
    document.getElementById("modalDetalleProductoLabel").textContent = producto.nombre;
    document.getElementById("detalle-imagen").src = producto.imagen;
    document.getElementById("detalle-imagen").alt = producto.nombre;
    document.getElementById("detalle-categoria").textContent = producto.categoria;

    const precioMostrado = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;
    document.getElementById("detalle-precio").textContent = formatearPrecio(precioMostrado);

    document.getElementById("detalle-descripcion").textContent = producto.descripcion;
    document.getElementById("detalle-cantidad").value = 1;

    // new bootstrap.Modal(...) crea el objeto que controla el modal,
    // y .show() lo abre visualmente
    const modal = new bootstrap.Modal(document.getElementById("modalDetalleProducto"));
    modal.show();
}

document.getElementById("detalle-btn-agregar").addEventListener("click", () => {
    // parseInt convierte el texto del input en número entero;
    // "|| 1" evita que quede en NaN si el campo está vacío
    const cantidad = parseInt(document.getElementById("detalle-cantidad").value) || 1;
    agregarAlCarrito(codigoProductoActivo, cantidad);

    // getInstance recupera el modal ya creado (no crea uno nuevo) para cerrarlo
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalDetalleProducto"));
    modal.hide();
});

/* Carrito (carritoGamer) */
function agregarAlCarrito(codigo, cantidad) {
    const producto = productos.find(p => p.codigo === codigo);
    if (!producto) return;

    const carritoActual = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    const precioFinal = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;

    // Cada unidad comprada se guarda como una copia distinta del producto
    // en el arreglo del carrito (sin campo "cantidad"), igual que hace
    // index.js cuando se agrega desde las tarjetas de ofertas.
    for (let i = 0; i < cantidad; i++) {
        carritoActual.push({
            ...producto,        // "..." copia todos los campos del producto (spread operator)
            precio: precioFinal // y se sobreescribe el precio con el valor final ya calculado
        });
    }

    localStorage.setItem("carritoGamer", JSON.stringify(carritoActual));

    actualizarContadorCarrito();
    renderizarCarrito();
}

// Elimina un solo ítem del carrito según su posición (índice) en el arreglo
function eliminarProductoDelCarrito(indice) {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    // splice(indice, 1) quita 1 elemento a partir de esa posición
    carrito.splice(indice, 1);
    localStorage.setItem("carritoGamer", JSON.stringify(carrito));

    actualizarContadorCarrito();
    renderizarCarrito();
}

// Actualiza el número que aparece junto al botón "Carrito" del navbar.
// Usa querySelector sobre la clase (no un id) porque así funciona en
// index.js, y es la misma clase que ya trae el badge en el navbar.
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    const badge = document.querySelector(".badge-contador");
    if (badge) {
        badge.textContent = carrito.length;
    }
}

// Dibuja los productos dentro del offcanvas del carrito.
// Misma estructura de ids que usa index.js: "contenedor-items-carrito"
// para la lista y "total-carrito" para el monto total.
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

        // Fila principal del ítem
        const itemRow = document.createElement("div");
        itemRow.className = "d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary";

        // Columna izquierda: imagen + nombre + precio
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
        precioTexto.textContent = formatearPrecio(producto.precio);

        textos.appendChild(titulo);
        textos.appendChild(precioTexto);

        infoCol.appendChild(miniatura);
        infoCol.appendChild(textos);

        // Botón derecho: eliminar este ítem del carrito
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

    totalElemento.textContent = formatearPrecio(totalAcumulado);
}

// Configura el botón "Vaciar Carrito": borra toda la clave "carritoGamer"
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



// Cada vez que el usuario cambia la categoría del filtro, se vuelve a dibujar el grid
document.getElementById("filtro-categoria").addEventListener("change", aplicarFiltro);

// Primer dibujo: grid completo, botón de vaciar, contador y carrito con lo que ya había guardado
renderizarProductos(productos);
configurarBotonVaciar();
actualizarContadorCarrito();
renderizarCarrito();