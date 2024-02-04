function cargarDatosGrafico() {

    fetch("http://185.60.40.210/dwc/Leire/AjaxYFetch/LeeXMLQuimica.php?elem=")
        .then(response => {
            if (!response.ok) {
                throw new Error("La solicitud no se pudo completar correctamente.");
            }
            return response.json();
        })
        .then(data => {
            const ctx = document.getElementById('grafico');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: array.forEach(element => {
                        
                    }),
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
        })
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}



