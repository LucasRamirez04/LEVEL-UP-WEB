// ==========================================================
// 1. INICIALIZACIÓN DE LOCALSTORAGE
// ==========================================================
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
// 2. DASHBOARD / KPIS
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
// 3. CRUD PRODUCTOS
// ==========================================================
const formProd = document.getElementById("formProducto");
const tablaProdCuerpo = document.getElementById("tabla-cuerpo-productos");
const inputProdIndex = document.getElementById("prod-index-edicion");
const tituloProdForm = document.getElementById("form-prod-titulo");
const btnGuardarProd = document.getElementById("btn-guardar-prod");
const btnCancelarProd = document.getElementById("btn-cancelar-prod");

function renderizarProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    tablaProdCuerpo.innerHTML = "";

    productos.forEach((prod, index) => {
        const tr = document.createElement("tr");

        const spanOferta = prod.enOferta 
            ? `<span class="badge bg-success text-dark">-${prod.descuento}%</span>` 
            : `<span class="badge bg-secondary">No</span>`;

        tr.innerHTML = `
            <td class="fw-bold text-success">${prod.codigo}</td>
            <td>${prod.nombre}</td>
            <td>${prod.categoria}</td>
            <td>$${Number(prod.precio).toLocaleString("es-CL")}</td>
            <td>${prod.stock}</td>
            <td>${spanOferta}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editarProducto(${index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tablaProdCuerpo.appendChild(tr);
    });

    actualizarDashboard();
}

function editarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const prod = productos[index];

    inputProdIndex.value = index;
    document.getElementById("prod-codigo").value = prod.codigo;
    document.getElementById("prod-nombre").value = prod.nombre;
    document.getElementById("prod-categoria").value = prod.categoria;
    document.getElementById("prod-precio").value = prod.precio;
    document.getElementById("prod-stock").value = prod.stock;
    document.getElementById("prod-descuento").value = prod.descuento || 0;
    document.getElementById("prod-enOferta").checked = prod.enOferta;
    document.getElementById("prod-imagen").value = prod.imagen || "";

    tituloProdForm.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Producto';
    btnGuardarProd.textContent = "Actualizar";
    btnGuardarProd.className = "btn btn-sm btn-warning flex-grow-1";
    btnCancelarProd.classList.remove("d-none");
}

function resetearFormularioProd() {
    formProd.reset();
    inputProdIndex.value = "-1";
    tituloProdForm.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Nuevo Producto';
    btnGuardarProd.textContent = "Guardar";
    btnGuardarProd.className = "btn btn-sm btn-success flex-grow-1";
    btnCancelarProd.classList.add("d-none");
}

btnCancelarProd.addEventListener("click", resetearFormularioProd);

formProd.addEventListener("submit", (e) => {
    e.preventDefault();

    const index = parseInt(inputProdIndex.value);
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const datosProd = {
        codigo: document.getElementById("prod-codigo").value.trim(),
        nombre: document.getElementById("prod-nombre").value.trim(),
        categoria: document.getElementById("prod-categoria").value,
        precio: parseFloat(document.getElementById("prod-precio").value),
        stock: parseInt(document.getElementById("prod-stock").value),
        descuento: parseInt(document.getElementById("prod-descuento").value) || 0,
        enOferta: document.getElementById("prod-enOferta").checked,
        imagen: document.getElementById("prod-imagen").value.trim() || "img/catan.jpg"
    };

    if (index === -1) {
        productos.push(datosProd);
    } else {
        productos[index] = datosProd;
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    resetearFormularioProd();
    renderizarProductos();
});

function eliminarProducto(index) {
    if (confirm("¿Deseas eliminar este producto?")) {
        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        productos.splice(index, 1);
        localStorage.setItem("productos", JSON.stringify(productos));
        renderizarProductos();
    }
}

// ==========================================================
// 4. CRUD USUARIOS
// ==========================================================
const formUser = document.getElementById("formUsuario");
const tablaUserCuerpo = document.getElementById("tabla-cuerpo-usuarios");
const inputUserIndex = document.getElementById("user-index-edicion");
const tituloUserForm = document.getElementById("form-user-titulo");
const btnGuardarUser = document.getElementById("btn-guardar-user");
const btnCancelarUser = document.getElementById("btn-cancelar-user");

function renderizarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    tablaUserCuerpo.innerHTML = "";

    usuarios.forEach((usr, index) => {
        const tr = document.createElement("tr");
        const badgeRol = usr.rol === "Administrador" 
            ? '<span class="badge bg-success">Administrador</span>' 
            : `<span class="badge bg-info text-dark">${usr.rol}</span>`;

        tr.innerHTML = `
            <td class="fw-bold">${usr.run}</td>
            <td>${usr.nombre} ${usr.apellidos}</td>
            <td>${usr.correo}</td>
            <td>${badgeRol}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning me-1" onclick="editarUsuario(${index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tablaUserCuerpo.appendChild(tr);
    });

    actualizarDashboard();
}

function editarUsuario(index) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usr = usuarios[index];

    inputUserIndex.value = index;
    document.getElementById("user-run").value = usr.run;
    document.getElementById("user-nombre").value = usr.nombre;
    document.getElementById("user-apellidos").value = usr.apellidos;
    document.getElementById("user-correo").value = usr.correo;
    document.getElementById("user-rol").value = usr.rol;

    tituloUserForm.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Usuario';
    btnGuardarUser.textContent = "Actualizar";
    btnGuardarUser.className = "btn btn-sm btn-warning flex-grow-1";
    btnCancelarUser.classList.remove("d-none");
}

function resetearFormularioUser() {
    formUser.reset();
    inputUserIndex.value = "-1";
    tituloUserForm.innerHTML = '<i class="bi bi-person-plus me-2"></i>Nuevo Usuario';
    btnGuardarUser.textContent = "Guardar";
    btnGuardarUser.className = "btn btn-sm btn-info text-white flex-grow-1";
    btnCancelarUser.classList.add("d-none");
}

btnCancelarUser.addEventListener("click", resetearFormularioUser);

formUser.addEventListener("submit", (e) => {
    e.preventDefault();

    const correo = document.getElementById("user-correo").value.trim().toLowerCase();
    const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
    const correoValido = dominiosValidos.some(dom => correo.endsWith(dom));

    if (!correoValido) {
        alert("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return;
    }

    const index = parseInt(inputUserIndex.value);
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const datosUsuario = {
        run: document.getElementById("user-run").value.trim(),
        nombre: document.getElementById("user-nombre").value.trim(),
        apellidos: document.getElementById("user-apellidos").value.trim(),
        correo: correo,
        rol: document.getElementById("user-rol").value
    };

    if (index === -1) {
        usuarios.push(datosUsuario);
    } else {
        usuarios[index] = datosUsuario;
    }

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    resetearFormularioUser();
    renderizarUsuarios();
});

function eliminarUsuario(index) {
    if (confirm("¿Deseas eliminar este usuario?")) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        renderizarUsuarios();
    }
}

// Carga inicial
renderizarProductos();
renderizarUsuarios();