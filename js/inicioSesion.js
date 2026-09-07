let formulario = document.getElementById("formularioLogin");

formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let correo = document.getElementById("correo").value;
    let contraseña = document.getElementById("contraseña").value;

    /* CORREO */
    if (correo === "") {
        alert("El correo es requerido.");
        return;
    }

    /* CONTRASEÑA */
    if (contraseña === "") {
        alert("La contraseña es requerida.");
        return;
    }

    /* OBTENER USUARIOS */
    let listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuarioEncontrado = null;

    /* BUSCAR COINCIDENCIA */
    for (let i = 0; i < listaUsuarios.length; i++) {
        let usuario = listaUsuarios[i];

        if (usuario.correo === correo && usuario.clave === contraseña) {
            usuarioEncontrado = usuario;
            break;
        }
    }

    /* VALIDACIÓN */
    if (usuarioEncontrado !== null) {
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioEncontrado));

        alert("¡Bienvenido " + usuarioEncontrado.nombre + "!");

        window.location.href = "index.html";
    } else {
        alert("Correo o contraseña incorrectos.");
    }
});