/*COMPROBAR INICIO DE SESION*/
window.addEventListener('load', event => {
    // console.log(localStorage.getItem('token'))
    if ((localStorage.getItem('token') == null) || (localStorage.getItem('token') == '{"message":"Invalid credentials"}')) {
        window.location = "../index.html"
    }
})

/*LOGOUT*/
const logOutBoton = document.getElementById("logout")
logout.addEventListener('click', e => {
    localStorage.removeItem('token')
    window.location = "../index.html"
})  

/**/
let localizacionesString = localStorage.getItem('localizacionesSeleccionadas') || ''


/*CARGAR DATOS DE LAS LOCALIZACIONES*/
let localizaciones = []
let datosLocalizaciones = []

function cargarDatosAPI() {

    fetch("http://localhost:8086/api/getData")
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no se pudo completar correctamente.");
            }
            return response.json();
        })
        .then(data => {
            localizaciones = data[0]
            datosLocalizaciones = data[1]
            // console.log(localizaciones)
            // console.log(datosLocalizaciones)

            localizaciones.forEach(localizacion => {

                var myIcon = L.icon({
                    iconUrl: '../img/iconos/icono_baliza_roja.svg',
                    iconSize: [25, 50],
                    iconAnchor: [10, 55],
                    popupAnchor: [-3, -76],
                });

                var marker = L.marker([localizacion.latitude, localizacion.longitude], { icon: myIcon }).addTo(map);

                marker._icon.classList.add("marcador");
                marker._icon.id = `${localizacion.name}`;
                marker._icon.title = `${localizacion.name}`;
                marker.on('click', function () { mostrarCard(localizacion.name) });

                datosLocalizaciones.forEach(datos => {
                    if (datos.location_id == localizacion.id) {
                        //añadimos las localizaciones a la vista
                        addCard(localizacion, datos)
                    }
                })

            });

            mostrarCardStorage()

        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}

cargarDatosAPI()


/*ACTUALIZAR DATOS API*/
setInterval(() => {
    actualizarDatosAPI()
}, 15000);

function actualizarDatosAPI() {
    fetch("http://localhost:8086/api/getData")
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no se pudo completar correctamente.");
            }
            return response.json();
        })
        .then(data => {
            localizaciones = data[0]
            datosLocalizaciones = data[1]
            actualizarDatosUbicacionSeleccionada()

        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}

function actualizarDatosCards() {

}


/*CREAR LAS CARDS*/
function addCard(localizacion, datos) {
    let card = document.createElement('div')
    let ubicacionesSeleccionadas = document.getElementById("ubicaciones_seleccionadas")

    card.className += "card_ubicacion"
    card.id = `card_${localizacion.name}`
    card.innerHTML += `
        <article class="div_icono">
            <img src="../img/iconos/sol.svg" alt="" id="icono">
        </article>
        <article class="div_info">
            <div id="primera_linea">
                <div id="temperatura">
                    <h3 id="texto_temperatura">${datos.temperature}º</h3>
                </div>
                <div id="eliminar" onClick="mostrarCard('${localizacion.name}')">
                    <img src="../img/iconos/cerrar.svg" alt="" width="23px">
                </div>
            </div>
            <div id="segunda_linea">
                <div id="lugar">
                    <p>${capitalizeFirstLetter(localizacion.name)}</p>
                    <p>País Vasco</p>
                </div>
                <div id="humedad">
                    <p>${datos.humidity}%</p>
                    <p>Humedad</p>
                </div>
            </div>
        </article>
    `
    card.addEventListener('click', function () {
        actualizarDatosUbicacionSeleccionada(localizacion, datos);
    });
    card.style.display = 'none'
    ubicacionesSeleccionadas.appendChild(card)

}

/*MOSTRAR/OCULTAR LAS CARDS SELECCIONADAS Y GUARDAR/QUITAR EN LOCAL STORAGE*/
function mostrarCard(localizacion) {

    // console.log(localizacion)

    let cardClickada = document.getElementById(`card_${localizacion}`)

    if (cardClickada.style.display == "none") {
        cardClickada.style.display = "flex"
        if (!localizacionesString.split(',').includes(localizacion)) {
            localizacionesString += `${localizacion},`
            localStorage.setItem('localizacionesSeleccionadas', localizacionesString)
        }
    } else {
        cardClickada.style.display = "none"
        let localizacionesArray = localizacionesString.split(',').filter(lugar => lugar != localizacion)
        localizacionesString = localizacionesArray.join(',')
        // console.log(localizacionesString)
        localStorage.setItem('localizacionesSeleccionadas', localizacionesString)
    }
}


/*MOSTRAR CARDS DE LOCAL STORAGE*/
function mostrarCardStorage() {
    let localizacionesArray = localizacionesString.split(',')
    localizacionesArray.forEach(localizacion => {
        if (localizacion != '') {
            document.getElementById(`card_${localizacion}`).style.display = "flex"
        }
    });
}


/*PARA QUE AL MOSTRAR LOS NOMBRES DE LAS CIUDADES TENGAN LA PRIMERA LETRA EN MAYUSCULA*/
function capitalizeFirstLetter(cadena) {
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}


/*ACTUALIZAR DATOS DE UBICACION*/
function actualizarDatosUbicacionSeleccionada(localizacion, datos) {

    /*ACTUALIZAR FECHA, HORA Y DIA SEMANA*/
    let contFecha = document.getElementById("fecha")

    let diaSemana = new Date().getDay()
    let fecha = new Date()
    let dia = fecha.getDate()
    let mes = fecha.getMonth()
    let year = fecha.getFullYear()
    let hora = new Date().getHours()
    let minutos = new Date().getMinutes()
    let cadena = '0'

    if (minutos < 10) {
        minutos = minutos.toString()
        cadena += minutos
        minutos = cadena
        // console.log(minutos)
    }

    // console.log(diaSemana)
    // console.log(fecha)
    // console.log(mes)
    // console.log(hora)
    // console.log(dia)

    let diaSemanaString = ''
    let mesString = ''

    switch (diaSemana) {
        case 1:
            diaSemanaString = 'Lunes'
            break;
        case 2:
            diaSemanaString = 'Martes'
            break;
        case 3:
            diaSemanaString = 'Miercoles'
            break;
        case 4:
            diaSemanaString = 'Jueves'
            break;
        case 5:
            diaSemanaString = 'Viernes'
            break;
        case 6:
            diaSemanaString = 'Sábado'
            break;
        case 7:
            diaSemanaString = 'Domingo'
            break;
        default:
            break;
    }

    switch (mes) {
        case 0:
            mesString = 'Enero'
            break;
        case 1:
            mesString = 'Febrero'
            break;
        case 2:
            mesString = 'Marzo'
            break;
        case 3:
            mesString = 'Abril'
            break;
        case 4:
            mesString = 'Mayo'
            break;
        case 5:
            mesString = 'Junio'
            break;
        case 6:
            mesString = 'Julio'
            break;
        case 7:
            mesString = 'Agosto'
            break;
        case 8:
            mesString = 'Septiembre'
            break;
        case 9:
            mesString = 'Octubre'
            break;
        case 10:
            mesString = 'Noviembre'
            break;
        case 11:
            mesString = 'Diciembres'
            break;

        default:
            break;
    }

    contFecha.innerHTML = ` <p class="titulo1" id="dia_semana">${diaSemanaString}</p><p><span id="fecha_info">${dia} de ${mesString} ${year}</span> · <span id="hora">${hora}:${minutos}</span></p>`


    /*ACTUALIZAR PRIMEROS DATOS*/
    let contCiudad = document.getElementById("ciudad")
    let contTemperatura = document.getElementById("info_principal_temperatura")
    let contDescripcion = document.getElementById("descripcion")

    contCiudad.innerHTML = `${capitalizeFirstLetter(localizacion.name)}`
    contTemperatura.innerHTML = `${datos.temperature}º`
    contDescripcion.innerHTML = `${datos.description}`



    /*ACTUALIZAR WIDGETS*/
    /* Humedad */
    let contHumedad = document.getElementById("humedad_widget_humedad")
    contHumedad.innerHTML = `${datos.humidity}<span class="medida_widget_pequeño_">%</span>`

    /* Viento */
    let contViento = document.getElementById("viento_widget_viento")
    contViento.innerHTML = `${datos.wind_speed}<span class="medida_widget_pequeño_">km/h</span> ${datos.wind_direction}`

    /* Amanecer y atardecer */
    let contAmanecer = document.getElementById("amanecer")
    let contAtardecer = document.getElementById("atardecer")

    let horaAmanecer = datos.sunrise
    horaAmanecer = horaAmanecer.split(':')
    let horaAmanecerCopia = horaAmanecer.slice(0, horaAmanecer.length - 1)
    horaAmanecer = horaAmanecerCopia.join(':')

    let horaAtardecer = datos.sunset
    horaAtardecer = horaAtardecer.split(':')
    let horaAtardecerCopia = horaAtardecer.slice(0, horaAtardecer.length - 1)
    horaAtardecer = horaAtardecerCopia.join(':')

    contAmanecer.innerHTML = `${horaAmanecer}`
    contAtardecer.innerHTML = `${horaAtardecer}`

}


/*DRAG AND DROP*/
$(document).ready(function () {

    $('.icono_widget').attr('draggable', true);

    $(".icono_widget").on("dragstart", function (event) {
        if (this.children.length) {
            event.originalEvent.dataTransfer.setData('text', this.id);
        } else {
            event.preventDefault();
        }
        //console.log(this.id);
    });

    $("#widgets").on("dragover", function (event) {
        event.preventDefault();
        console.log(this.id);
    })

    $("#widgets").on("drop", function (event) {
        event.preventDefault();
        // console.log(this.id);
        const id_widget = event.originalEvent.dataTransfer.getData('text')
        switch (id_widget) {
            case "sol":
                $('#sol').hide()
                $('#widget_sol').show()
                break;

            case "lluvias":
                $('#lluvias').hide()
                $('#widget_precipitaciones').show()
                break;

            case "viento":
                $('#viento').hide()
                $('#widget_viento').show()
                break;

            default:
                break;
        }
    });

});

