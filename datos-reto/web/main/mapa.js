window.addEventListener('load', event => {
    if(localStorage.getItem('token') == null) {
        window.location = "../index.html"
    }
})

$(document).ready(function () {

    /*DRAG AND DROP*/
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