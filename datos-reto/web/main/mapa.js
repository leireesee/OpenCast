window.addEventListener('load', event => {
    if(localStorage.getItem('token') == null) {
        window.location = "index.html"
    }
})