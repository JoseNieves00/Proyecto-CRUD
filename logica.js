function enviar(correo, password) {
    $.ajax({
        type: "POST",
        url: "login.php",
        data: { correo: correo, password: password },
        success: function (response) {
            var data;
            try {
                data = JSON.parse(response);
            } catch (error) {
                data = response;
            }

            if (data.success) {
                localStorage.setItem("usuario", correo)
                ingresoExitoso()
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Inicio de sesión fallido",
                    text: "Verifica tus credenciales.",
                    showConfirmButton: false,
                    timer: 1200,
                });
            }
        },
        error: function (xhr, status, error) {
            Swal.fire({
                icon: "error",
                title: "Opss",
                text: "Error en la solicitud al servidor. Código de estado: " + xhr.status,
                showConfirmButton: false,
                timer: 1200,
            });
        }
    });
}

async function ingresoExitoso() {
    login_cont.style.display = "none";
    loader_cont.style.display = "flex";
    textUsuario.textContent = localStorage.getItem("usuario")
    setTimeout(() => {
        Swal.fire({
            title: "Bienvenido " + textUsuario.textContent + "!",
            showConfirmButton: false,
            confirmButtonColor: "rgb(3, 192, 249)",
            timer: 1500,
        });
        panel_inicio.style.display = "flex"
        loader_cont.style.display = "none";
    }, 1500);
    apiFisrt(api)
}

function salida() {
    panel_inicio.style.display = "none";
    loader_cont.style.display = "flex";
    setTimeout(() => {
        login_cont.style.display = "flex"
        loader_cont.style.display = "none";
    }, 1500);
    removerUsuariosInterno()
}

async function ingresoRecurrente() {
    let usuarioActivo = localStorage.getItem("usuario")
    login_cont.style.display = "none";
    loader_cont.style.display = "flex";
    textUsuario.textContent = usuarioActivo
    setTimeout(() => {
        Swal.fire({
            title: "Bienvenido de nuevo " + usuarioActivo + "!",
            showConfirmButton: false,
            timer: 1200,
        });
        panel_inicio.style.display = "flex"
        loader_cont.style.display = "none";
    }, 900);
    datosLocal()
}

function removerUsuariosInterno() {
    for (let i = 1; i <= 6; i++) {
        localStorage.removeItem('usuario_' + i);
    }
}

function guardarDatosInterno(user) {
    const storedUser = localStorage.getItem('usuario_' + user.id);

    if (!storedUser) {
        localStorage.setItem('usuario_' + user.id, JSON.stringify(user));
    }
}

function apiFisrt(api) {
    card_cont.innerHTML = " "
    fetch(api)
        .then((response) => response.json())
        .then((data) => {
            cargarUsuarios(data.data);
            data.data.forEach(user => {
                guardarDatosInterno(user)
            })
        })

    api2 = "https://reqres.in/api/users?page=" + 2
    fetch(api2)
        .then((response) => response.json())
        .then((data) => {

            data.data.forEach(user => {
                guardarDatosInterno(user)
            })
        })

}

function datosLocal() {
    page = 1
    isSearching = false
    const users = [];
    for (let i = 1; i <= 6; i++) {
        const storedUser = localStorage.getItem('usuario_' + i);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            users.push(user);
        }
    }
    cargarUsuarios(users);
}

function exitInformacionBox() {
    if (!isEditing) {
        blur_box.style.display = "none"
        informacion_box.style.display = "none"
    }
}

let isEditing = false

let isSearching = false

function cargarUsuarios(users) {
    card_cont.innerHTML = " ";
    const filtro = buscarInput.value.toLowerCase();
    if (users.length > 1) {
        users.forEach(user => {
            const nombreCompleto = `${user.first_name} ${user.last_name}`.toLowerCase();
            if (nombreCompleto.includes(filtro)) {
                let box = document.createElement('div')
                box.className = 'card'
                box.setAttribute('id', user.id)
                card_cont.appendChild(box);

                const avatar = document.createElement('img');
                avatar.src = user.avatar;
                box.appendChild(avatar);
                avatar.className = 'avatar';

                const fullName = document.createElement('h2');
                fullName.textContent = user.first_name + " " + user.last_name;
                box.appendChild(fullName);
                fullName.className = 'name';

                const funciones_box = document.createElement("div")
                funciones_box.className = "funciones-box"
                box.appendChild(funciones_box)

                const puntos_box = document.createElement('button')
                puntos_box.className = "puntos-box"
                funciones_box.appendChild(puntos_box)

                const puntos_img = document.createElement('img')
                puntos_img.className = "puntos-img"
                puntos_img.src = "img/tres-puntos.png"
                puntos_box.appendChild(puntos_img)

                puntos_box.addEventListener("click", () => {

                    blur_box.style.display = "flex"
                    informacion_box.style.display = "flex"

                    informacion_box.innerHTML = ""

                    const exit_img = document.createElement('img')
                    exit_img.src = "img/cruzar.png"
                    exit_img.classList = "exit-img"
                    informacion_box.appendChild(exit_img)

                    const avatar_d = document.createElement('img');
                    avatar_d.src = user.avatar;
                    informacion_box.appendChild(avatar_d);
                    avatar_d.className = 'avatar-d';

                    const datos_box = document.createElement('div')
                    datos_box.classList = "datos-box"
                    informacion_box.appendChild(datos_box)

                    const fullName_d = document.createElement('p');
                    fullName_d.innerHTML = "<span>Nombre completo:</span> </br>" + user.first_name + " " + user.last_name;
                    datos_box.appendChild(fullName_d);
                    fullName_d.className = 'name';

                    const email_d = document.createElement('p');
                    email_d.innerHTML = "<span>Email:</span> </br>" + user.email;
                    datos_box.appendChild(email_d);
                    email_d.className = 'email';

                    const funciones_box_d = document.createElement("div")
                    funciones_box_d.className = "funciones-box"
                    datos_box.appendChild(funciones_box_d)

                    const editar_box = document.createElement('button')
                    editar_box.className = "editar-box"
                    funciones_box_d.appendChild(editar_box)

                    const editar_img = document.createElement('img')
                    editar_img.className = "editar-img"
                    editar_img.src = "img/editar.png"
                    editar_box.appendChild(editar_img)

                    const eliminar_box = document.createElement('button');
                    eliminar_box.className = "eliminar-box";
                    funciones_box_d.appendChild(eliminar_box);

                    const eliminar_img = document.createElement('img');
                    eliminar_img.className = "eliminar-img";
                    eliminar_img.src = "img/eliminar.png";
                    eliminar_box.appendChild(eliminar_img);

                    eliminar_box.addEventListener("click", () => {
                        Swal.fire({
                            title: "Estás seguro de eliminar este usuario?",
                            showDenyButton: false,
                            showCancelButton: true,
                            confirmButtonText: "Eliminar",
                            cancelButtonText: `No Eliminar`,
                            confirmButtonColor: "#eb9042",
                            icon: "warning"
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                eliminarUsuario(user);
                            }
                        });

                    })

                    editar_box.addEventListener("click", () => {
                        isEditing = true
                        datos_box.innerHTML = ""

                        const firstName_box = document.createElement('div')
                        firstName_box.classList = "firstName-box"
                        datos_box.appendChild(firstName_box)

                        const firstNameText = document.createElement('p')
                        firstNameText.textContent = "Nombre:"
                        firstName_box.appendChild(firstNameText)

                        const firstNameInput = document.createElement('input')
                        firstNameInput.type = "text"
                        firstNameInput.value = user.first_name
                        firstNameInput.classList = "firstName-input"
                        firstName_box.appendChild(firstNameInput)

                        const lastName_box = document.createElement('div')
                        lastName_box.classList = "lastName-box"
                        datos_box.appendChild(lastName_box)

                        const lastNameText = document.createElement('p')
                        lastNameText.textContent = "Apellido:"
                        lastName_box.appendChild(lastNameText)

                        const lastNameInput = document.createElement('input')
                        lastNameInput.type = "text"
                        lastNameInput.value = user.last_name
                        firstNameInput.classList = "lastName-input"
                        lastName_box.appendChild(lastNameInput)

                        const emailBox = document.createElement('div')
                        emailBox.classList = "email-box"
                        datos_box.appendChild(emailBox)

                        const emailText = document.createElement('p')
                        emailText.textContent = "Email:"
                        emailBox.appendChild(emailText)

                        const emailInput = document.createElement('input')
                        emailInput.type = "email"
                        emailInput.value = user.email
                        firstNameInput.classList = "email-input"
                        emailBox.appendChild(emailInput)

                        const funciones_box_d = document.createElement("div")
                        funciones_box_d.className = "funciones-box"
                        informacion_box.appendChild(funciones_box_d)

                        const exitEdit_box = document.createElement('button')
                        exitEdit_box.className = "exitEdit-box"
                        funciones_box_d.appendChild(exitEdit_box)

                        const exitEdit_img = document.createElement('img')
                        exitEdit_img.className = "exitEdit-img"
                        exitEdit_img.src = "img/cruzar.png"
                        exitEdit_box.appendChild(exitEdit_img)

                        const guardar_box = document.createElement('button')
                        guardar_box.className = "guardar-box"
                        funciones_box_d.appendChild(guardar_box)

                        const guardar_img = document.createElement('img')
                        guardar_img.className = "guardar-img"
                        guardar_img.src = "img/guardar.png"
                        guardar_box.appendChild(guardar_img)

                        guardar_box.addEventListener("click", () => {
                            if (emailInput.value != "" && firstNameInput.value != "" && lastNameInput.value != "") {

                                Swal.fire({
                                    title: "Estas seguro de hacer estos cambios ?",
                                    showDenyButton: false,
                                    showCancelButton: true,
                                    confirmButtonText: "Guardar",
                                    cancelButtonText: `No Guardar`,
                                    confirmButtonColor: "#eb9042",
                                    icon: "warning"
                                }).then((result) => {
                                    /* Read more about isConfirmed, isDenied below */
                                    if (result.isConfirmed) {
                                        let nombre = firstNameInput.value
                                        let apellido = lastNameInput.value
                                        let email = emailInput.value
                                        editarUsuario(user, nombre, apellido, email)
                                        isEditing = false
                                        exitInformacionBox()
                                    }
                                });
                            } else {
                                Swal.fire({
                                    title: "Ingrese todos los Datos",
                                    icon: "error",
                                    confirmButtonColor: "rgb(251, 29, 29)",
                                });
                            }
                        })

                        exitEdit_box.addEventListener("click", () => {

                            Swal.fire({
                                title: "Deseas Cerrar el editor ?",
                                text: "Se perderan los cambios no guardados",
                                showDenyButton: false,
                                showCancelButton: true,
                                confirmButtonText: "Cerrar",
                                cancelButtonText: `No cerrar`,
                                confirmButtonColor: "#eb9042",
                                icon: "warning"
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    isEditing = false
                                    exitInformacionBox()
                                }
                            });
                        })

                        exit_img.addEventListener("click", () => {
                            Swal.fire({
                                title: "Deseas Cerrar el editor ?",
                                text: "Se perderan los cambios no guardados",
                                showDenyButton: false,
                                showCancelButton: true,
                                confirmButtonText: "Cerrar",
                                cncelButtonText: `No cerrar`,
                                confirmButtonColor: "#eb9042",
                                icon: "warning"
                            }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    isEditing = false
                                    exitInformacionBox()
                                }
                            });
                        })
                    })

                    exit_img.addEventListener("click", () => {
                        exitInformacionBox()
                    })

                    blur_box.addEventListener("click", () => {
                        exitInformacionBox()
                    })
                }
            )}    
        });
    } else {
        const errorH2 = document.createElement('h2')
        errorH2.textContent = "No se encontraron coincidencias"
        card_cont.appendChild(errorH2)
        errorH2.className = "errorFilter"
    }

}

function filtrarUsuarios() {
    cargarUsuarios(datosFiltrados());
}

function datosFiltrados() {
    const users = [];
    const filtro = buscarInput.value.toLowerCase();

    // Filtrar usuarios por coincidencia en el nombre
    for (let i = 1; i <= 12; i++) {
        const storedUser = localStorage.getItem('usuario_' + i);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const nombreCompleto = `${user.first_name} ${user.last_name}`.toLowerCase();
            if (nombreCompleto.includes(filtro)) {
                users.push(user);
            }
        }
    }

    return users;
}


function editarUsuario(usuario, nombre, apellido, email) {
    localStorage.removeItem('usuario_' + usuario.id);

    const usuarioEditado = {
        id: usuario.id,
        avatar: usuario.avatar,
        first_name: nombre,
        last_name: apellido,
        email: email,
    };

    setTimeout(() => {
        Swal.fire({
            icon: "success",
            title: "Usuario Editado Correctamente!",
            showConfirmButton: false,
            timer: 1500
        });
    }, 400);



    localStorage.setItem('usuario_' + usuarioEditado.id, JSON.stringify(usuarioEditado));


    exitInformacionBox()
    buscarInput.value = ""
    datosLocal();
}

function eliminarUsuario(user) {
    localStorage.removeItem('usuario_' + user.id);

    setTimeout(() => {
        Swal.fire({
            icon: "success",
            title: "Usuario Eliminado Correctamente!",
            showConfirmButton: false,
            timer: 1500
        });
    }, 400);



    exitInformacionBox()

    datosLocal()
}



const login_cont = document.querySelector(".login-cont")
const panel_inicio = document.querySelector(".inicio-cont")
const emailInpt = document.getElementsByClassName("email-inpt")[0];
const passwordInpt = document.getElementsByClassName("password-inpt")[0];
const form = document.getElementsByClassName("login-form")[0];
const img_visible = document.querySelector(".img-visible")
const img_novisible = document.querySelector(".img-novisible")
const loader_cont = document.querySelector(".loading-cont")
const card_cont = document.querySelector(".cards-usuarios")
const sig_page = document.querySelector(".sig-pag")
const ant_page = document.querySelector(".ant-pag")
const header_cont = document.querySelector(".header")
const textUsuario = document.querySelector(".usuario-header")
const btn_cerrarsc = document.querySelector(".cerrar-sesion")
const blur_box = document.querySelector(".blur")
const informacion_box = document.querySelector(".informacion-box")
const email_edit = document.querySelector(".email-input")
const lastName_edit = document.querySelector(".lastName-input")
const firstName_edit = document.querySelector(".firstName-input")
const buscarInput = document.querySelector(".search-input")
const a_pag1 = document.querySelector(".a-pag1")
const a_pag2 = document.querySelector(".a-pag2")



let page = 1
let api = "https://reqres.in/api/users?page=" + page

document.addEventListener("DOMContentLoaded", () => {
    const usuarioAlmacenado = localStorage.getItem("usuario");

    if (usuarioAlmacenado) {
        ingresoRecurrente()
    }

});

panel_inicio.style.display = "none"
loader_cont.style.display = "none"
img_novisible.style.display = "none"
blur_box.style.display = "none"
informacion_box.style.display = "none"

buscarInput.addEventListener("input", () => {
    if (buscarInput.value == "") {
        datosLocal()
    } else {
        isSearching = true
        filtrarUsuarios()
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    enviar(emailInpt.value, passwordInpt.value);
});

img_visible.addEventListener("click", () => {
    img_visible.style.display = "none"
    img_novisible.style.display = "block"
    passwordInpt.type = "text"
})

img_novisible.addEventListener("click", () => {
    img_visible.style.display = "block"
    img_novisible.style.display = "none"
    passwordInpt.type = "password"
})

sig_page.addEventListener("click", () => {
    let anteriorPage = page
    if (!isSearching) {
        if (page < 2) {
            page += 1
            const users = [];
            for (let i = 7; i <= 12; i++) {
                const storedUser = localStorage.getItem('usuario_' + i);
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    users.push(user);
                }
            }
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            cargarUsuarios(users);
        } else {
            page == anteriorPage
            Swal.fire({
                title: "No Hay Mas Usuarios Disponibles",
                showConfirmButton: false,
                icon: "error",
                timer: "1000",
            });

        }
    } else {
        buscarInput.value = ""
        datosLocal()
    }

})


ant_page.addEventListener("click", () => {
    let anteriorPage = page
    if (!isSearching) {
        if (page >= 1 && anteriorPage > 1) {
            page -= 1
            const users = [];
            for (let i = 1; i <= 6; i++) {
                const storedUser = localStorage.getItem('usuario_' + i);
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    users.push(user);
                }
            }
            cargarUsuarios(users);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            page = anteriorPage
        }
    }
})

a_pag1.addEventListener("click", () => {
    if (!isSearching) {
        page = a_pag1.textContent
        const users = [];
        for (let i = 1; i <= 6; i++) {
            const storedUser = localStorage.getItem('usuario_' + i);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                users.push(user);
            }
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        cargarUsuarios(users);

    }
})

a_pag2.addEventListener("click", () => {
    if (!isSearching) {
        page = a_pag2.textContent
        const users = [];
        for (let i = 7; i <= 12; i++) {
            const storedUser = localStorage.getItem('usuario_' + i);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                users.push(user);
            }
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        cargarUsuarios(users);
    } else {
        buscarInput.value = ""
        datosLocal()
    }
})

btn_cerrarsc.addEventListener("click", () => {

    Swal.fire({
        title: "Deseas cerrar tu session ?",
        text: "Se perderan todos los cambios",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Cerrar",
        denyButtonText: `No Cerrar`,
        confirmButtonColor: "#eb9042",
        icon: "warning",
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            localStorage.removeItem("usuario")
            salida()
        }
    });
}) 

