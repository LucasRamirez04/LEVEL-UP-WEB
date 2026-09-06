// ==========================================================
// 1. INICIALIZACIÓN DE DATOS (localStorage)
// ==========================================================

// Si no hay usuarios de prueba creados, agregamos uno inicial
if (!localStorage.getItem("usuarios")) {
    const usuarioAdmin = [
        {
            run: "212888192",
            nombre: "Lucas",
            apellidos: "Administrador",
            correo: "admin@duoc.cl",
            rol: "Administrador"
        }
    ];
    localStorage.setItem("usuarios", JSON.stringify(usuarioAdmin));
}

// ==========================================================
// 2. KPIS DEL DASHBOARD
// ==========================================================
function actualizarDashboard() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const kpiProd = document.getElementById("total-productos-kpi");
    const kpiOfer = document.getElementById("total-ofertas-kpi");
    const kpiUser = document.getElementById("total-usuarios-kpi");

    if (kpiProd) kpiProd.textContent = productos.length;
    if (kpiOfer) kpiOfer.textContent = productos.filter(p => p.enOferta).length;
    if (kpiUser) kpiUser.textContent = usuarios.length;
}

// ==========================================================
// 3. CRUD DE PRODUCTOS
// ==========================================================
const tablaProdCuerpo = document.getElementById("tabla-cuerpo-productos");
const formProd = document.getElementById("formProducto");
const modalProdElemento = document.getElementById("modalProducto");
const modalProdInstancia = new bootstrap.Modal(modalProdElemento);

function renderizarTablaProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    tablaProdCuerpo.innerHTML = "";

    productos.forEach((prod, index) => {
        const tr = document.createElement("tr");

        // Código
        const tdCod = document.createElement("td");
        tdCod.className = "fw-bold text-success";
        tdCod.textContent = prod.codigo;

        // Imagen miniatura
        const tdImg = document.createElement("td");
        const miniatura = document.createElement("img");
        miniatura.src = prod.imagen || "img/catan.jpg";
        miniatura.style.width = "40px";
        miniatura.style.height = "40px";
        miniatura.style.objectFit = "cover";
        miniatura.className = "rounded border border-secondary";
        tdImg.appendChild(miniatura);

        // Nombre
        const tdNom = document.createElement("td");
        tdNom.textContent = prod.nombre;

        // Categoría
        const tdCat = document.createElement("td");
        tdCat.textContent = prod.categoria;

        // Precio
        const tdPre = document.createElement("td");
        tdPre.textContent = `$${Number(prod.precio).toLocaleString("es-CL")}`;

        // Oferta
        const tdOfe = document.createElement("td");
        const spanOfe = document.createElement("span");
        if (prod.enOferta) {
            spanOfe.className = "badge bg-success text-dark";
            spanOfe.textContent = `-${prod.descuento}%`;
        } else {
            spanOfe.className = "badge bg-secondary";
            spanOfe.textContent = "No";
        }
        tdOfe.appendChild(spanOfe);

        // Acciones (Editar y Eliminar)
        const tdAcc = document.createElement("td");
        tdAcc.className = "text-end";

        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-sm btn-outline-warning me-2";
        btnEdit.innerHTML = '<i class="bi bi-pencil"></i>';
        btnEdit.addEventListener("click", () => cargarProductoParaEditar(index));

        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn btn-sm btn-outline-danger";
        btnBorrar.innerHTML = '<i class="bi bi-trash"></i>';
        btnBorrar.addEventListener("click", () => eliminarProducto(index));

        tdAcc.appendChild(btnEdit);
        tdAcc.appendChild(btnBorrar);

        tr.appendChild(tdCod);
        tr.appendChild(tdImg);
        tr.appendChild(tdNom);
        tr.appendChild(tdCat);
        tr.appendChild(tdPre);
        tr.appendChild(tdOfe);
        tr.appendChild(tdAcc);

        tablaProdCuerpo.appendChild(tr);
    });

    actualizarDashboard();
}

function eliminarProducto(index) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.splice(index, 1); // Quita el elemento del arreglo
        localStorage.setItem("productos", JSON.stringify(productos));
        renderizarTablaProductos();
    }
}

function cargarProductoParaEditar(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const prod = productos[index];

    document.getElementById("tituloModalProd").textContent = "Editar Producto";
    document.getElementById("prod-index-edicion").value = index;
    document.getElementById("prod-codigo").value = prod.codigo;
    document.getElementById("prod-nombre").value = prod.nombre;
    document.getElementById("prod-categoria").value = prod.categoria;
    document.getElementById("prod-precio").value = prod.precio;
    document.getElementById("prod-descuento").value = prod.descuento || 0;
    document.getElementById("prod-imagen").value = prod.imagen || "";
    document.getElementById("prod-enOferta").checked = prod.enOferta;

    modalProdInstancia.show();
}

// Limpiar modal al cerrarse o abrirse como "Nuevo"
modalProdElemento.addEventListener("hidden.bs.modal", () => {
    formProd.reset();
    document.getElementById("prod-index-edicion").value = "-1";
    document.getElementById("tituloModalProd").textContent = "Nuevo Producto";
});

// Guardar (Agregar o Editar)
formProd.addEventListener("submit", (e) => {
    e.preventDefault();

    const index = parseInt(document.getElementById("prod-index-edicion").value);
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const nuevoProd = {
        codigo: document.getElementById("prod-codigo").value.trim(),
        nombre: document.getElementById("prod-nombre").value.trim(),
        categoria: document.getElementById("prod-categoria").value,
        precio: parseFloat(document.getElementById("prod-precio").value),
        descuento: parseInt(document.getElementById("prod-descuento").value) || 0,
        imagen: document.getElementById("prod-imagen").value.trim() || "img/catan.jpg",
        enOferta: document.getElementById("prod-enOferta").checked
    };

    if (index === -1) {
        // AGREGAR
        productos.push(nuevoProd);
    } else {
        // EDITAR
        productos[index] = nuevoProd;
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    modalProdInstancia.hide();
    renderizarTablaProductos();
});

// ==========================================================
// 4. CRUD DE USUARIOS
// ==========================================================
const tablaUserCuerpo = document.getElementById("tabla-cuerpo-usuarios");
const formUser = document.getElementById("formUsuario");
const modalUserElemento = document.getElementById("modalUsuario");
const modalUserInstancia = new bootstrap.Modal(modalUserElemento);

function renderizarTablaUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    tablaUserCuerpo.innerHTML = "";

    usuarios.forEach((usr, index) => {
        const tr = document.createElement("tr");

        // Nombre y Apellidos
        const tdNom = document.createElement("td");
        tdNom.textContent = `${usr.nombre} ${usr.apellidos}`;

        // Correo
        const tdCor = document.createElement("td");
        tdCor.textContent = usr.correo;

        // Rol
        const tdRol = document.createElement("td");
        const spanRol = document.createElement("span");
        spanRol.className = usr.rol === "Administrador" ? "badge bg-success" : "badge bg-info text-dark";
        spanRol.textContent = usr.rol;
        tdRol.appendChild(spanRol);

        // Acciones
        const tdAcc = document.createElement("td");
        tdAcc.className = "text-end";

        const btnEdit = document.createElement("button");
        btnEdit.className = "btn btn-sm btn-outline-warning me-2";
        btnEdit.innerHTML = '<i class="bi bi-pencil"></i>';
        btnEdit.addEventListener("click", () => cargarUsuarioParaEditar(index));

        const btnBorrar = document.createElement("button");
        btnBorrar.className = "btn btn-sm btn-outline-danger";
        btnBorrar.innerHTML = '<i class="bi bi-trash"></i>';
        btnBorrar.addEventListener("click", () => eliminarUsuario(index));

        tdAcc.appendChild(btnEdit);
        tdAcc.appendChild(btnBorrar);

        tr.appendChild(tdNom);
        tr.appendChild(tdCor);
        tr.appendChild(tdRol);
        tr.appendChild(tdAcc);

        tablaUserCuerpo.appendChild(tr);
    });

    actualizarDashboard();
}

function eliminarUsuario(index) {
    if (confirm("¿Deseas eliminar este usuario?")) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        renderizarTablaUsuarios();
    }
}

function cargarUsuarioParaEditar(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usr = usuarios[index];

    document.getElementById("tituloModalUser").textContent = "Editar Usuario";
    document.getElementById("user-index-edicion").value = index;
    document.getElementById("user-run").value = usr.run;
    document.getElementById("user-nombre").value = usr.nombre;
    document.getElementById("user-apellidos").value = usr.apellidos;
    document.getElementById("user-correo").value = usr.correo;
    document.getElementById("user-rol").value = usr.rol;

    modalUserInstancia.show();
}

modalUserElemento.addEventListener("hidden.bs.modal", () => {
    formUser.reset();
    document.getElementById("user-index-edicion").value = "-1";
    document.getElementById("tituloModalUser").textContent = "Nuevo Usuario";
});

// Guardar Usuario
formUser.addEventListener("submit", (e) => {
    e.preventDefault();

    const index = parseInt(document.getElementById("user-index-edicion").value);
    const correo = document.getElementById("user-correo").value.trim().toLowerCase();

    // Validación de dominio de correo solicitada en reglas
    const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const correoValido = dominiosValidos.some(dom => correo.endsWith(dom));

    if (!correoValido) {
        alert("El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const nuevoUsuario = {
        run: document.getElementById("user-run").value.trim(),
        nombre: document.getElementById("user-nombre").value.trim(),
        apellidos: document.getElementById("user-apellidos").value.trim(),
        correo: correo,
        rol: document.getElementById("user-rol").value
    };

    if (index === -1) {
        usuarios.push(nuevoUsuario);
    } else {
        usuarios[index] = nuevoUsuario;
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    modalUserInstancia.hide();
    renderizarTablaUsuarios();
});

// ==========================================================
// 5. LLAMADOS INICIALES
// ==========================================================
renderizarTablaProductos();
renderizarTablaUsuarios();