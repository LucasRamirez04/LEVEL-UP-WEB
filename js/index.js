// ==========================================
// 1. CATÁLOGO BASE DE PRODUCTOS
// ==========================================
const inventarioProductos = [
    {
        codigo: "JM001",
        categoria: "Juegos de Mesa",
        nombre: "Catan",
        precio: 29000,
        stock : 3,
        enOferta: true,
        descuento: 30,
        imagen: "img/catan.jpg"
    },
    {
        codigo: "JM002",
        categoria: "Juegos de Mesa",
        nombre: "Carcassonne",
        precio: 24990,
        stock : 2,
        enOferta: false,
        descuento: 0,
        imagen: "img/carcassonne.jpg"
    },
    {
        codigo: "AC001",
        categoria: "Accesorios",
        nombre: "Controlador Inalámbrico Xbox Series X",
        precio: 59990,
        stock : 2,
        enOferta: true,
        descuento: 15,
        imagen: "img/control-xbox.webp"
    },
    {
        codigo: "AC002",
        categoria: "Accesorios",
        nombre: "Auriculares Gamer HyperX Cloud II",
        precio: 79990,
        stock : 2,
        enOferta: false,
        descuento: 20,
        imagen: "img/audifonos-hyperx.jpg"
    },
    {
        codigo: "CO001",
        categoria: "Consolas/Computadores",
        nombre: "PlayStation5",
        precio: 549990,
        stock : 4,
        enOferta: false,
        descuento: 0,
        imagen: "img/play5.jpg"
    },
    {
        codigo: "CO002",
        categoria: "Consolas/Computadores",
        nombre: "PC Gamer ASUS ROG Strix",
        precio: 1299990,
        stock : 2,
        enOferta: true,
        descuento: 15,
        imagen: "img/asus-rog.png"
    },
    {
        codigo: "PE001",
        categoria: "Perifericos",
        nombre: "Silla Gamer Secretlab Titan",
        precio: 349990,
        stock : 5,
        enOferta: false,
        descuento: 0,
        imagen: "img/sillagamer3.jpg"
    },
    {
        codigo: "PE002",
        categoria: "Perifericos",
        nombre: "Mouse Gamer Logitech G502 HERO",
        precio: 49990,
        stock : 5,
        enOferta: true,
        descuento: 5,
        imagen: "img/g502.webp"
    },
    {
        codigo: "PE003",
        categoria: "Perifericos",
        nombre: "Mousepad Razer Goliathus Extended Chroma",
        precio: 29990,
        stock : 10,
        enOferta: false,
        descuento: 0,
        imagen: "img/mousepad.webp"
    },
    {
        codigo: "VE001",
        categoria: "Vestuario",
        nombre: "Polera Gamer Personalizada 'Level-Up'",
        precio: 14990,
        stock : 30,
        enOferta: false,
        descuento: 0,
        imagen: "img/polera.jpg"
    }
];

// Inicializar la clave única en localStorage
if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(inventarioProductos));
}


// ==========================================
// FILTRAR MEJORES OFERTAS
// ==========================================
const catalogoCompleto = JSON.parse(localStorage.getItem("productos")) || [];

const ofertasEspeciales = catalogoCompleto
    .filter(producto => producto.enOferta)
    .sort((a, b) => b.descuento - a.descuento)
    .slice(0, 3);

// ==========================================
// MOSTRAR PRODUCTOS DE OFERTAS ESPECIALES
// ==========================================
const contenedor = document.getElementById("contenedor-ofertas");

if (contenedor) {
    ofertasEspeciales.forEach((producto) => {
        // Columna
        const col = document.createElement("div");
        col.className = "col-12 col-md-4";

        // Tarjeta
        const card = document.createElement("div");
        card.className = "card h-100 bg-dark text-white border-secondary position-relative overflow-hidden";

        // Insignia de descuento flotante
        const badge = document.createElement("span");
        badge.className = "badge position-absolute top-0 end-0 m-2 px-2 py-1";
        badge.style.backgroundColor = "#39FF14";
        badge.style.color = "#000000";
        badge.style.fontWeight = "bold";
        badge.textContent = `-${producto.descuento}% OFF`;

        // Imagen
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = producto.imagen;
        img.alt = producto.nombre;
        img.style.height = "250px";
        img.style.objectFit = "contain";
        img.style.backgroundColor = "#111";
        img.style.padding = "10px";

        // Cuerpo de la tarjeta
        const cardBody = document.createElement("div");
        cardBody.className = "card-body d-flex flex-column";

        // Título
        const titulo = document.createElement("h5");
        titulo.className = "card-title";
        titulo.textContent = producto.nombre;

        // Precios (Original tachado y final rebajado)
        const bloquePrecios = document.createElement("div");
        bloquePrecios.className = "my-2";

        const precioOriginal = producto.precio;
        const precioTachado = document.createElement("small");
        precioTachado.className = "text-decoration-line-through text-secondary me-2";
        precioTachado.textContent = `$${precioOriginal.toLocaleString("es-CL")}`;

        const precioRebajado = Math.round(precioOriginal * (1 - producto.descuento / 100));
        const precioFinal = document.createElement("span");
        precioFinal.className = "fw-bold fs-5";
        precioFinal.style.color = "#39FF14";
        precioFinal.textContent = `$${precioRebajado.toLocaleString("es-CL")}`;

        bloquePrecios.appendChild(precioTachado);
        bloquePrecios.appendChild(precioFinal);

        // Botón de acción
        const btnAgregar = document.createElement("a");
        btnAgregar.className = "btn mt-auto botonAgregar";
        btnAgregar.href = "#";
        btnAgregar.textContent = "Añadir al Carrito";

        // Evento: Guardar en el storage aplicando el descuento
        btnAgregar.addEventListener("click", (e) => {
            e.preventDefault();
            const carritoActual = JSON.parse(localStorage.getItem("carritoGamer")) || [];
            
            carritoActual.push({
                ...producto,
                precio: precioRebajado // Cobro exacto del valor con oferta
            });

            localStorage.setItem("carritoGamer", JSON.stringify(carritoActual));

            actualizarContadorCarrito();
            renderizarCarrito();
        });

        // Ensamblado
        cardBody.appendChild(titulo);
        cardBody.appendChild(bloquePrecios);
        cardBody.appendChild(btnAgregar);

        card.appendChild(badge);
        card.appendChild(img);
        card.appendChild(cardBody);

        col.appendChild(card);
        contenedor.appendChild(col);
    });
}

// ==========================================
// 4. GESTIÓN DEL CARRITO (OFcanvas & Contador)
// ==========================================

// Actualiza la burbuja del navbar
function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    const badge = document.querySelector(".badge-contador");
    if (badge) {
        badge.textContent = carrito.length;
    }
}

// Dibuja los productos dentro del offcanvas
function renderizarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carritoGamer")) || [];
    const contenedorCarrito = document.getElementById("contenedor-items-carrito");
    const totalElemento = document.getElementById("total-carrito");
    const btnLimpiar = document.getElementById("btn-limpiar-carrito");

    if (!contenedorCarrito || !totalElemento) return;

    contenedorCarrito.innerHTML = "";

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

    carrito.forEach((producto, indice) => {
        totalAcumulado += producto.precio;

        // Fila principal
        const itemRow = document.createElement("div");
        itemRow.className = "d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary";

        // Columna izquierda: Imagen y textos
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

        const precio = document.createElement("small");
        precio.className = "texto-neon-verde fw-bold";
        precio.textContent = `$${producto.precio.toLocaleString("es-CL")}`;

        textos.appendChild(titulo);
        textos.appendChild(precio);

        infoCol.appendChild(miniatura);
        infoCol.appendChild(textos);

        // Botón derecho: Eliminar ítem individual
        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn btn-sm btn-outline-danger";
        btnBorrar.innerHTML = '<i class="bi bi-x-lg"></i>';
        btnBorrar.setAttribute("aria-label", "Quitar producto");

        btnBorrar.addEventListener("click", () => {
            eliminarProductoDelCarrito(indice);
        });

        // Ensamblado
        itemRow.appendChild(infoCol);
        itemRow.appendChild(btnBorrar);
        contenedorCarrito.appendChild(itemRow);
    });

    totalElemento.textContent = `$${totalAcumulado.toLocaleString("es-CL")}`;
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


configurarBotonVaciar();
actualizarContadorCarrito();
renderizarCarrito();