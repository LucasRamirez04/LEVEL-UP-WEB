let regiones = ["Región Metropolitana de Santiago", "Región de la Araucanía", "Región de Ñuble"];

let cajaRegion = document.getElementById("region");
let cajaComuna = document.getElementById("comuna");

for (let i = 0; i < regiones.length; i++) {
    cajaRegion.innerHTML += '<option>' + regiones[i] + '</option>';
}

cajaRegion.addEventListener("change", function () {
    let regionElegida = cajaRegion.value;
    cajaComuna.innerHTML = '<option>-- Seleccione la Comuna --</option>';

    if (regionElegida === "Región Metropolitana de Santiago") {
        let comunasRM = ["Santiago", "La Florida", "Maipú", "Puente Alto", "Providencia"];
        for (let i = 0; i < comunasRM.length; i++) {
            cajaComuna.innerHTML += '<option>' + comunasRM[i] + '</option>';
        }
    }
    else if (regionElegida === "Región de la Araucanía") {
        let comunasAraucania = ["Temuco", "Villarrica", "Pucón", "Angol", "Victoria"];
        for (let i = 0; i < comunasAraucania.length; i++) {
            cajaComuna.innerHTML += '<option>' + comunasAraucania[i] + '</option>';
        }
    }
    else if (regionElegida === "Región de Ñuble") {
        let comunasNuble = ["Chillán", "San Carlos", "Bulnes", "Quillón", "Coihueco"];
        for (let i = 0; i < comunasNuble.length; i++) {
            cajaComuna.innerHTML += '<option>' + comunasNuble[i] + '</option>';
        }
    }
});

let formulario = document.getElementById("formularioRegistro");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let run = document.getElementById("run").value;
    let nombre = document.getElementById("nombre").value;
    let apellidos = document.getElementById("apellidos").value;
    let correo = document.getElementById("correo").value;
    let contraseña = document.getElementById("contraseña").value;
    let confirmarContraseña = document.getElementById("confirmarContraseña").value;
    let region = document.getElementById("region").value;
    let comuna = document.getElementById("comuna").value;
    let direccion = document.getElementById("direccion").value;

    /* RUN */
    if (run === "") {
        alert("El RUN es requerido.");
        return;
    }
    if (run.includes(".") || run.includes("-")) {
        alert("El RUN debe ser ingresado sin puntos ni guion.");
        return;
    }
    if (run.length < 7 || run.length > 9) {
        alert("El RUN debe tener entre 7 y 9 caracteres.");
        return;
    }

    /* NOMBRE */
    if (nombre === "") {
        alert("El nombre es requerido.");
        return;
    }
    if (nombre.length > 50) {
        alert("El nombre no puede tener más de 50 caracteres.");
        return;
    }

    /* APELLIDOS */
    if (apellidos === "") {
        alert("Los apellidos son requeridos.");
        return;
    }
    if (apellidos.length > 100) {
        alert("Los apellidos no pueden tener más de 100 caracteres.");
        return;
    }

    /* CORREO */
    if (correo === "") {
        alert("El correo es requerido.");
        return;
    }
    if (correo.length > 100) {
        alert("El correo no puede tener más de 100 caracteres.");
        return;
    }
    if (!correo.endsWith("@duoc.cl") && !correo.endsWith("@profesor.duoc.cl") && !correo.endsWith("@gmail.com")) {
        alert("El correo solo puede ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
        return;
    }

    /* CONTRASEÑA */
    if (contraseña === "") {
        alert("La contraseña es requerida.");
        return;
    }
    if (contraseña.length < 4 || contraseña.length > 10) {
        alert("La contraseña debe tener entre 4 y 10 caracteres.");
        return;
    }

    /* CONFIRMAR CONTRASEÑA */
    if (confirmarContraseña === "") {
        alert("Debe confirmar su contraseña.");
        return;
    }
    if (contraseña !== confirmarContraseña) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    /* REGIÓN */
    if (region === "-- Seleccione la Región --" || region === "") {
        alert("Debe seleccionar una región.");
        return;
    }

    /* COMUNA */
    if (comuna === "-- Seleccione la Comuna --" || comuna === "") {
        alert("Debe seleccionar una comuna.");
        return;
    }

    /* DIRECCIÓN */
    if (direccion === "") {
        alert("La dirección es requerida.");
        return;
    }
    if (direccion.length > 300) {
        alert("La dirección no puede tener más de 300 caracteres.");
        return;
    }

    let cuentaNueva = {
        correoElectronico: correo,
        clave: contraseña,
        nombreUsuario: nombre,
        direccion: direccion
    };

    /* ALMACENAMIENTO DE USUARIOS EN EL STORAGE */
    let listaUsuarios = JSON.parse(localStorage.getItem("Usuarios")) || [];

    listaUsuarios.push(cuentaNueva);

    localStorage.setItem("Usuarios", JSON.stringify(listaUsuarios));

    alert("¡Registro exitoso!");

    formulario.reset();
});