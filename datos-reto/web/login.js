/*COMPROBAR TOKEN DE INICIO DE SESION*/
// window.addEventListener('load', e => {
//     if((localStorage.getItem('token') != null) || (localStorage.getItem('token') != '{"message":"Invalid credentials"}')) {
//         window.location = "main/mapa.html"
//     }
// })

/*INICIO DE SESION*/
const form = document.querySelector('form')
form.addEventListener('submit', event => {
    event.preventDefault() //si estan mal los datos no recarga la pagina

    const urlAPI = 'http://localhost:8086/api/login'

    const data = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    fetch(urlAPI, config)
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            if (data['access_token'] !== null) {
                localStorage.setItem('token', JSON.stringify(data))
                window.location = "main/mapa.html"
            }
        })
        .catch(error => {
            console.error('API error:', error);
        })
})