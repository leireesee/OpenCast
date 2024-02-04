/*COMPROBAR INICIO DE SESION*/
window.addEventListener('load', event => {
    if (localStorage.getItem('token') == null) {
        window.location = "../index.html"
    }
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
                    <img src="../img/iconos/cerrar.svg" alt="" width="30px">
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

