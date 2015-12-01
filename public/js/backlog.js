$(document).on("pagecontainerbeforeshow", function(e,ui){
    var pageid = ui.toPage.attr("id");
    switch(pageid){
        case "login":
            //....
            ingreso_login(ui.toPage);
            break;
    }
});
function ingreso_login(backlog_page){
    $.get(
        "/api/login",
        {},
        function(docs, success, xhr){
              chage_page("perfil")
            });
            }
        },
        "json"
    );
}

// Funcion para cambiar de pagina
function chage_page(to){
    $(":mobile-pagecontainer").pagecontainer("change", "#" + to);
}
