/*REGISTRAR USUARIO*/
const form = document.querySelector('form')
form.addEventListener('submit', event => {
    event.preventDefault() //si estan mal los datos no recarga la pagina

    const urlAPI = 'http://'+urlActual+':8086/api/register'

    let data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }
    console.log(data)
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    console.log(config)
    fetch(urlAPI, config)
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            console.log(data['access_token'])
            if (data['access_token'] !== null) {
                localStorage.setItem('token', JSON.stringify(data))
                window.location = "main/mapa.html"
            }
        })
        .catch(error => {
            console.error('API error:', error);
        })
})