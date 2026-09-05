const inventarioProductos = [
    {
        codigo : "JM001",
        categoria : "Juegos de Mesa",
        nombre : "Catan",
        precio : 29000,
        enOferta : true,
        descuento : 30,
        imagen : "img/catan.jpg"

    },
    {
        codigo : "JM002",
        categoria : "Juegos de Mesa",
        nombre : "Carcassonne",
        precio : 24990,
        enOferta : false,
        descuento : 0,
        imagen : "img/carcassonne.png"

    },
    {
        codigo : "AC001",
        categoria : "Accesorios",
        nombre : "Controlador Inalámbrico Xbox Series X",
        precio : 59990,
        enOferta : true,
        descuento : 15,
        imagen : "img/control-xbox.png"

    },
    {
        codigo : "AC002",
        categoria : "Accesorios",
        nombre : "Auriculares Gamer HyperX Cloud II",
        precio : 79990,
        enOferta : false,
        descuento : 20,
        imagen : "img/audifonos-hyperx.png"

    },
    {
        codigo : "CO001",
        categoria : "Consolas/Computadores",
        nombre : "PlayStation5",
        precio : 549990,
        enOferta : false,
        descuento : 0,
        imagen : "img/play5.png"

    },
    {
        codigo : "CO002",
        categoria : "Consolas/Computadores",
        nombre : "PC Gamer ASUS ROG Strix",
        precio : 1299990,
        enOferta : true,
        descuento : 15,
        imagen : "img/asus-rog.png"

    },
    {
        codigo : "PE001",
        categoria : "Perisfericos",
        nombre : "Silla Gamer Secretlab Titan",
        precio : 349990,
        enOferta : false,
        descuento : 0,
        imagen : "img/silla-gamer.png"

    },
    {
        codigo : "PE002",
        categoria : "Perisfericos",
        nombre : "Mouse Gamer Logitech G502 HERO",
        precio : 49990,
        enOferta : true,
        descuento : 5,
        imagen : "img/g502.png"

    },
    {
        codigo : "PE003",
        categoria : "Perisfericos",
        nombre : "Mousepad Razer Goliathus Extended Chroma",
        precio : 29990,
        enOferta : false,
        descuento : 0,
        imagen : "img/mousepad.png"

    },
    {
        codigo : "VE001",
        categoria : "Vestuario",
        nombre : "Polera Gamer Personalizada 'Level-Up'",
        precio : 14990,
        enOferta : false,
        descuento : 0,
        imagen : "img/polera.jpg"

    }
]

if (!localStorage.getItem("productos")){
    localStorage.setItem("productos",JSON.stringify(inventarioProductos))
}

const catalogoCompleto = JSON.parse(localStorage.getItem("productos")) || [];

const ofertasEspeciales = catalogoCompleto.filter(producto => producto.enOferta).sort((a, b) => b.descuento - a.descuento).slice(0,3);

// 3. Referencia al contenedor
const contenedor = document.getElementById("contenedor-ofertas");


// 4. Renderizado con document.createElement
ofertasEspeciales.forEach((producto) => {

    // Contenedor de columna
    const col = document.createElement("div");
    col.className = "col-12 col-md-4";

    // Tarjeta base
    const card = document.createElement("div");
    card.className = "card h-100 bg-dark text-white border-secondary position-relative";

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
    img.style.height = "250px";          // Un poco más de altura para apreciar la portada
    img.style.objectFit = "contain";     // Muestra la imagen completa sin recortar
    img.style.backgroundColor = "#111"; // Fondo oscuro para rellenar los costados
    img.style.padding = "10px"; 55

    // Cuerpo de la tarjeta
    const cardBody = document.createElement("div");
    cardBody.className = "card-body d-flex flex-column";

    // Título
    const titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.textContent = producto.nombre;

   // Contenedor de precios
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

    // Ensamblar precios
    bloquePrecios.appendChild(precioTachado);
    bloquePrecios.appendChild(precioFinal);

    // Botón de acción
    const btnAgregar = document.createElement("a");
    btnAgregar.className = "btn mt-auto botonAgregar";
    btnAgregar.href = "#";
    btnAgregar.textContent = "Añadir al Carrito";

    // Guardado en carrito
    btnAgregar.addEventListener("click", (e) => {
        e.preventDefault();
        const carritoActual = JSON.parse(localStorage.getItem("carritoGamer")) || [];
        carritoActual.push(producto);
        localStorage.setItem("carritoGamer", JSON.stringify(carritoActual));
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
