/*COMPROBAR INICIO DE SESION*/
window.addEventListener('load', event => {
    // console.log(localStorage.getItem('token'))
    if ((localStorage.getItem('token') == null) || (localStorage.getItem('token') == '{"message":"Invalid credentials"}')) {
        window.location = "../index.html"
    }
})

let ciudadMostrada = ''

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

    fetch('http://' + urlActual + ':8086/api/getData')
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
                cargarDatosTooltip(localizacion)

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
    fetch('http://' + urlActual + ':8086/api/getData')
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
                datosLocalizaciones.forEach(datos => {
                    let card = document.getElementById(`card_${localizacion.name}`)

                    if (datos.location_id == localizacion.id) {
                        card.addEventListener('click', function () {
                            actualizarDatosUbicacionSeleccionada(localizacion, datos)
                            cargarGrafico(localizacion, datos)
                        });
                        if (ciudadMostrada == localizacion.name) {
                            actualizarDatosUbicacionSeleccionada(localizacion, datos)
                        }
                        actualizarCards(localizacion, datos)
                    }
                })

            });

        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}


function actualizarCards(localizacion, datos) {
    let cardActualizar = document.getElementById(`card_${localizacion.name}`)
    cardActualizar.innerHTML = `
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
        actualizarDatosUbicacionSeleccionada(localizacion, datos)
        cargarGrafico(localizacion, datos)
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


/*TOOLTIP*/
function cargarDatosTooltip(localizacion) {

    // console.log(localizacion)

    let fechaActual = new Date()
    let fechaManana = new Date()
    fechaManana.setDate(parseInt(fechaActual.getDate()) + 1)

    // let fechaActualSeparada = fechaActual.toISOString().split('T')[0].split('-').join("/")
    let fechaActualSeparada = fechaActual.toISOString().split('T')[0].split('-').join("/")
    let fechaMananaSeparada = fechaManana.toISOString().split('T')[0].split('-').join('')



    // console.log(fechaActualSeparada)
    // console.log(fechaMananaSeparada)

    const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtZXQwMS5hcGlrZXkiLCJpc3MiOiJJRVMgUExBSUFVTkRJIEJISSBJUlVOIiwiZXhwIjoyMjM4MTMxMDAyLCJ2ZXJzaW9uIjoiMS4wLjAiLCJpYXQiOjE2Mzk3NDc5MDcsImVtYWlsIjoiaWtjZmNAcGxhaWF1bmRpLm5ldCJ9.PwlkDxwtidWSjLo81yRgf6vITaU5yGDH1TgXAVf5Ijl07Bz8auOyQX3uMGiC8GhGiHHymNDBK1IoM3C1aeasdGngQsAMoS9jbiGNGNOhb9JthJnY778zPBxZ6EzlnZEuDFRDGZCRbB4IkyzQk677rP3Nt0v5GPU8g2F4uacpTCWwj0k_fQsCCfhNY89ECGV1pFMwJc_9m7Rezzxd6IMxLyir7MgaWWRGvGb1kH4XqBV_roBBSIO70j4P-p0udoZIuRKWrDZexrSeX9G_brJJplwzoI2eo8mQVX3u3uzn-9E2iystKe0IS3k6uLYiHnNuPQnCkIBUg3JAhu_q9V8iIg';

    const options = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    switch (localizacion.name) {
        case 'gasteiz':
            console.log(localizacion.name)
            console.log(fechaActualSeparada)
            console.log(fechaMananaSeparada)
            const url = `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/vitoria_gasteiz/locations/${localizacion.name}/forecast/at/${fechaActualSeparada}/for/${fechaMananaSeparada}`

            console.log(url)

            fetch(url, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data["temperature"]["value"]);
                    let descripcion = data["forecastText"]["SPANISH"].split(' ')
                    let descripcionMostrar = descripcion[0]
                    descripcionMostrar += ' ' . descripcion[1]
                    descripcionMostrar += ' ' . descripcion[2]
                    descripcionMostrar += '.'

                    let temperaturaMostrar = Math.round(data["temperature"]["value"])


                    $(function () {
                        $(`#${localizacion.name}`).tooltip({
                            classes: {
                                "ui-tooltip": "balizas"
                            },
                            position: { my: "bottom-13", at: "top" },
                            content: `
                            <div>
                                <p style='font-size: 14px; font-weight: 400'>Mañana:</p>
                                
                                <div style='display:flex; align-items: flex-end; justify-content: space-between; position: relative'>
                                    <article>
                                        <p style='font-size: 45px; font-weight: 600; line-height: 43px; margin-bottom: 7px'>
                                            ${temperaturaMostrar}º</p>
                                    </article>
                                    <article>
                                        <img style='margin-right: 15px' src='../img/iconos/sol.svg' width='55px'
                                            style='filter: drop-shadow(0px 0px 10px rgb(0, 71, 255, 0.25))'>
                                    </article>
                                </div>
                                <div>
                                    <p style='font-weight: 200; font-size: 13px'>${descripcionMostrar}</p>
                                </div>
                            </div>
                            
                        
                        <img src='../img/iconos/piquito.svg' width='20px' style='position: absolute; bottom: -10px; left: 75px'>
                        `
                        });
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            break;

        case 'bilbao':
            console.log(localizacion.name)
            console.log(fechaActualSeparada)
            console.log(fechaMananaSeparada)
            const url2 = `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/great_bilbao/locations/${localizacion.name}/forecast/at/${fechaActualSeparada}/for/${fechaMananaSeparada}`

            fetch(url2, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data["temperature"]["value"]);
                    let descripcionMostrar = data["forecastText"]["SPANISH"].split('.')
                    descripcionMostrar[0] += '.'

                    let temperaturaMostrar = Math.round(data["temperature"]["value"])


                    $(function () {
                        $(`#${localizacion.name}`).tooltip({
                            classes: {
                                "ui-tooltip": "balizas"
                            },
                            position: { my: "bottom-13", at: "top" },
                            content: `
                            <div>
                                <p style='font-size: 14px; font-weight: 400'>Mañana:</p>
                                
                                <div style='display:flex; align-items: flex-end; justify-content: space-between; position: relative'>
                                    <article>
                                        <p style='font-size: 45px; font-weight: 600; line-height: 43px; margin-bottom: 7px'>
                                            ${temperaturaMostrar}º</p>
                                    </article>
                                    <article>
                                        <img style='margin-right: 15px' src='../img/iconos/sol.svg' width='55px'
                                            style='filter: drop-shadow(0px 0px 10px rgb(0, 71, 255, 0.25))'>
                                    </article>
                                </div>
                                <div>
                                    <p style='font-weight: 200; font-size: 13px'>${descripcionMostrar[0]}</p>
                                </div>
                            </div>
                            
                        
                        <img src='../img/iconos/piquito.svg' width='20px' style='position: absolute; bottom: -10px; left: 75px'>
                        `
                        });
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            break;

        case 'donostia':
            console.log(localizacion.name)
            console.log(fechaActualSeparada)
            console.log(fechaMananaSeparada)
            const url3 = `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/donostialdea/locations/${localizacion.name}/forecast/at/${fechaActualSeparada}/for/${fechaMananaSeparada}`

            fetch(url3, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data["temperature"]["value"]);
                    let descripcionMostrar = data["forecastText"]["SPANISH"].split('.')
                    descripcionMostrar[0] += '.'

                    let temperaturaMostrar = Math.round(data["temperature"]["value"])


                    $(function () {
                        $(`#${localizacion.name}`).tooltip({
                            classes: {
                                "ui-tooltip": "balizas"
                            },
                            position: { my: "bottom-13", at: "top" },
                            content: `
                            <div>
                                <p style='font-size: 14px; font-weight: 400'>Mañana:</p>
                                
                                <div style='display:flex; align-items: flex-end; justify-content: space-between; position: relative'>
                                    <article>
                                        <p style='font-size: 45px; font-weight: 600; line-height: 43px; margin-bottom: 7px'>
                                            ${temperaturaMostrar}º</p>
                                    </article>
                                    <article>
                                        <img style='margin-right: 15px' src='../img/iconos/sol.svg' width='55px'
                                            style='filter: drop-shadow(0px 0px 10px rgb(0, 71, 255, 0.25))'>
                                    </article>
                                </div>
                                <div>
                                    <p style='font-weight: 200; font-size: 13px'>${descripcionMostrar[0]}</p>
                                </div>
                            </div>
                            
                        
                        <img src='../img/iconos/piquito.svg' width='20px' style='position: absolute; bottom: -10px; left: 75px'>
                        `
                        });
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            break;

        case 'hondarribia':
            console.log(localizacion.name)
            console.log(fechaActualSeparada)
            console.log(fechaMananaSeparada)
            const url4 = `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/coast_zone/locations/${localizacion.name}/forecast/at/${fechaActualSeparada}/for/${fechaMananaSeparada}`

            fetch(url4, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data["temperature"]["value"]);
                    let descripcionMostrar = data["forecastText"]["SPANISH"].split('.')
                    descripcionMostrar[0] += '.'

                    let temperaturaMostrar = Math.round(data["temperature"]["value"])


                    $(function () {
                        $(`#${localizacion.name}`).tooltip({
                            classes: {
                                "ui-tooltip": "balizas"
                            },
                            position: { my: "bottom-13", at: "top" },
                            content: `
                            <div>
                                <p style='font-size: 14px; font-weight: 400'>Mañana:</p>
                                
                                <div style='display:flex; align-items: flex-end; justify-content: space-between; position: relative'>
                                    <article>
                                        <p style='font-size: 45px; font-weight: 600; line-height: 43px; margin-bottom: 7px'>
                                            ${temperaturaMostrar}º</p>
                                    </article>
                                    <article>
                                        <img style='margin-right: 15px' src='../img/iconos/sol.svg' width='55px'
                                            style='filter: drop-shadow(0px 0px 10px rgb(0, 71, 255, 0.25))'>
                                    </article>
                                </div>
                                <div>
                                    <p style='font-weight: 200; font-size: 13px'>${descripcionMostrar[0]}</p>
                                </div>
                            </div>
                            
                        
                        <img src='../img/iconos/piquito.svg' width='20px' style='position: absolute; bottom: -10px; left: 75px'>
                        `
                        });
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            break;

        case 'irun':
            console.log(localizacion.name)
            console.log(fechaActualSeparada)
            console.log(fechaMananaSeparada)
            const url5 = `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/coast_zone/locations/${localizacion.name}/forecast/at/${fechaActualSeparada}/for/${fechaMananaSeparada}`

            fetch(url5, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data["temperature"]["value"]);
                    let descripcionMostrar = data["forecastText"]["SPANISH"].split('.')
                    descripcionMostrar[0] += '.'

                    let temperaturaMostrar = Math.round(data["temperature"]["value"])


                    $(function () {
                        $(`#${localizacion.name}`).tooltip({
                            classes: {
                                "ui-tooltip": "balizas"
                            },
                            position: { my: "bottom-13", at: "top" },
                            content: `
                            <div>
                                <p style='font-size: 14px; font-weight: 400'>Mañana:</p>
                                
                                <div style='display:flex; align-items: flex-end; justify-content: space-between; position: relative'>
                                    <article>
                                        <p style='font-size: 45px; font-weight: 600; line-height: 43px; margin-bottom: 7px'>
                                            ${temperaturaMostrar}º</p>
                                    </article>
                                    <article>
                                        <img style='margin-right: 15px' src='../img/iconos/sol.svg' width='55px'
                                            style='filter: drop-shadow(0px 0px 10px rgb(0, 71, 255, 0.25))'>
                                    </article>
                                </div>
                                <div>
                                    <p style='font-weight: 200; font-size: 13px'>${descripcionMostrar[0]}</p>
                                </div>
                            </div>
                            
                        
                        <img src='../img/iconos/piquito.svg' width='20px' style='position: absolute; bottom: -10px; left: 75px'>
                        `
                        });
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            break;

        case 'oiartzun':
            console.log(localizacion.name)
            console.log(fechaActualSeparada)
            console.log(fechaMananaSeparada)
            const url6 = `https://api.euskadi.eus/euskalmet/weather/regions/basque_country/zones/cantabrian_valleys/locations/${localizacion.name}/forecast/at/${fechaActualSeparada}/for/${fechaMananaSeparada}`

            fetch(url6, options)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data["temperature"]["value"]);
                    let descripcionMostrar = data["forecastText"]["SPANISH"].split('.')
                    descripcionMostrar[0] += '.'

                    let temperaturaMostrar = Math.round(data["temperature"]["value"])


                    $(function () {
                        $(`#${localizacion.name}`).tooltip({
                            classes: {
                                "ui-tooltip": "balizas"
                            },
                            position: { my: "bottom-13", at: "top" },
                            content: `
                            <div>
                                <p style='font-size: 14px; font-weight: 400'>Mañana:</p>
                                
                                <div style='display:flex; align-items: flex-end; justify-content: space-between; position: relative'>
                                    <article>
                                        <p style='font-size: 45px; font-weight: 600; line-height: 43px; margin-bottom: 7px'>
                                            ${temperaturaMostrar}º</p>
                                    </article>
                                    <article>
                                        <img style='margin-right: 15px' src='../img/iconos/sol.svg' width='55px'
                                            style='filter: drop-shadow(0px 0px 10px rgb(0, 71, 255, 0.25))'>
                                    </article>
                                </div>
                                <div>
                                    <p style='font-weight: 200; font-size: 13px'>${descripcionMostrar[0]}</p>
                                </div>
                            </div>
                            
                        
                        <img src='../img/iconos/piquito.svg' width='20px' style='position: absolute; bottom: -10px; left: 75px'>
                        `
                        });
                    });
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
            break;

        default:
            break;
    }

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
    }

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

    ciudadMostrada = `${localizacion.name}`

}


/*DRAG AND DROP*/
$(document).ready(function () {
    $('.icono_widget').attr('draggable', true);

    $(".icono_widget").on("dragstart", function (event) {
        // console.log(this.id)
        if (this.children.length) {
            event.originalEvent.dataTransfer.setData('text', this.id);
        } else {
            event.preventDefault();
        }
        // console.log(this.id);
    });

    $("#widgets").on("dragover", function (event) {
        // console.log(this.id);
        event.preventDefault();
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

        let contWidgets = document.getElementById("div_iconos_drag_and_drop")

        if (($('#sol').is(":hidden")) && ($('#lluvias').is(":hidden")) && ($('#viento').is(":hidden"))) {
            setTimeout(() => {
                alert('Arrastre los elemntos de vuelta para eliminarlos')
            }, 100);
        }
    });


    /*DRAG AND DROP DE VUELTA*/
    $('#widget_viento').attr('draggable', true);
    $('#widget_precipitaciones').attr('draggable', true);
    $('#widget_sol').attr('draggable', true);

    $("#widget_viento").on("dragstart", function (event) {
        if (this.children.length) {
            event.originalEvent.dataTransfer.setData('text', this.id);
        } else {
            event.preventDefault();
        }
        // console.log(this.id);
    });

    $("#widget_precipitaciones").on("dragstart", function (event) {
        if (this.children.length) {
            event.originalEvent.dataTransfer.setData('text', this.id);
        } else {
            event.preventDefault();
        }
        // console.log(this.id);
    });

    $("#widget_sol").on("dragstart", function (event) {
        if (this.children.length) {
            event.originalEvent.dataTransfer.setData('text', this.id);
        } else {
            event.preventDefault();
        }
        // console.log(this.id);
    });

    $("#div_iconos_drag_and_drop").on("dragover", function (event) {
        // console.log(this.id);
        event.preventDefault();

    })

    $("#div_iconos_drag_and_drop").on("drop", function (event) {
        event.preventDefault();
        let contWidgets = document.getElementById("div_iconos_drag_and_drop")

        const id_widget = event.originalEvent.dataTransfer.getData('text')
        // console.log(id_widget)
        switch (id_widget) {
            case "widget_sol":
                $('#sol').show()
                $('#widget_sol').hide()
                break;

            case "widget_precipitaciones":
                $('#lluvias').show()
                $('#widget_precipitaciones').hide()
                break;

            case "widget_viento":
                $('#viento').show()
                $('#widget_viento').hide()
                break;

            default:
                break;
        }

    });

});


/*CARGAR GRAFICO*/
function cargarGrafico() {

    const ctx = document.getElementById('grafico');
    // console.log()
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1, 2, 3],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


/*CONTROLAR FORM DE FECHAS PARA GRAFICO*/
function controlFechaMaximaMinima(cadena) {

    let fechaIniString = document.getElementById("fecha_ini")
    let fechaFinString = document.getElementById("fecha_fin")

    /*CONTROL DE FECHA FIN MAXIMA LA FECHA DE HOY*/
    let fechaActual = new Date()
    let fechaFinDate = new Date(fechaFinString.value)

    /*CONTROL DE SELECCION DE MAXIMO 1 SEMANA*/
    if (cadena == 'ini') {
        /*creo la fecha a partir de la fecha de inicio*/
        let fechaIniDate = new Date(fechaIniString.value)

        /*especifico que la fecha fin minima es la fecha inicio*/
        fechaFinString.min = fechaIniDate.toISOString().split('T')[0]

        /*sumo a la fecha de inicio 6 dias*/
        fechaIniDate.setDate(fechaIniDate.getDate() + 6)

        /*especifico que la fecha fin maxima es la fecha inicio + 6*/
        fechaFinString.max = fechaIniDate.toISOString().split('T')[0]


    } else if (cadena == 'fin') {
        /*creo la fecha a partir de la fecha de fin*/
        let fechaFinDate = new Date(fechaFinString.value)

        /*especifico que la fecha ini maxima es la fecha fin*/
        fechaIniString.max = fechaFinDate.toISOString().split('T')[0]

        /*resto a la fecha de fin 6 dias*/
        fechaFinDate.setDate(fechaFinDate.getDate() - 6)

        /*especifico que la fecha ini minima es la fecha inicio - 6*/
        fechaIniString.min = fechaFinDate.toISOString().split('T')[0]
    }


    // let fechaIni = document.getElementById("fecha_ini")
    // // console.log(fechaIni)
    // // console.log(fechaFin)
    // let fechaIniDate = new Date(fechaIni.value)
    // let fechaFinDate = new Date(fechaFin.value)
    // // fechaIniDate.setDate(fechaIniDate.getDate() + 7)
    // fechaIni.max = fechaFinDate.toISOString().split('T')[0]
    // fechaFinDate.setDate(fechaFinDate.getDate() - 7)
    // fechaIni.min = fechaFinDate.toISOString().split('T')[0]

    // fechaFin.min = fechaIniDate.toISOString().split('T')[0]
}