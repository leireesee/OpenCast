DatosAPIProvincias() //trae todas las provincias

function DatosAPIProvincias() {
    var divResultado = document.getElementById('Elemento');

    fetch("https://www.el-tiempo.net/api/json/v2/provincias")
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no se pudo completar correctamente.");
            }
            return response.text();
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}

DatosAPIProvinciaMunicipios() //trae todos los municipios de una provincia

function DatosAPIProvinciaMunicipios() {
    var divResultado = document.getElementById('Elemento');

    fetch("https://www.el-tiempo.net/api/json/v2/provincias/20/municipios")
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no se pudo completar correctamente.");
            }
            return response.text();
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}

DatosAPIProvinciaMunicipiosMeteorologia() //trae todos los municipios de una provincia

function DatosAPIProvinciaMunicipiosMeteorologia() {
    var divResultado = document.getElementById('Elemento');

    fetch("https://www.el-tiempo.net/api/json/v2/provincias/20/municipios/20045")
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no se pudo completar correctamente.");
            }
            return response.text();
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}