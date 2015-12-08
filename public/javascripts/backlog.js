var newbacklogBinded = false, uploadBtnBinded = false, btnloginBinded = false, btnRegisterBinded = false,btnTegBinded=false;
var selectedBacklogItemID = "";
var content, html, picFile;


$(document).on("mobileinit", function(e){
    $.mobile.loader.prototype.options.text = "Please Wait";
    $.mobile.loader.prototype.options.textVisible = true;

    $.ajaxSetup({
        xhrFields:{
            withCredentials:true
        }
    });
});

$(document).ajaxError(function(e, xhr, set, err){
    if(xhr.status===403){
        change_page("login");
    }
});
/*
Con el evento pagebeforechange se puede obtener a qué página se está
dirigiendo y tener control sobre el flujo. En este evento se puede
controlar el acceso a las pantallas:
1) Si no está logueado cambiar la página a otra
2) Si no está seteado la variable de consulta regresar a la lista de
   consulta.
*/
$(document).on("pagebeforechange", function(e, data) {
    if (typeof data.toPage === "object") {
        var pageid = data.toPage.attr("id");
        switch (pageid) {
            case "picUpload":
            case "backlogdetail":
                if (selectedBacklogItemID === "") {
                    data.toPage[0] = $("#backlog")[0];
                    $.extend(data.options, {
                        transition: "flip"
                    });
                }
                break;
        }
    }
});

$(document).on("pagecontainerbeforeshow", function(e, ui) {
    var pageid = ui.toPage.attr("id");
    switch (pageid) {
        case "backlog":
            //....
            load_backlog_data(ui.toPage);
            break;
        case "Restaurantes":
            load_restaurantes(ui.toPage);
        break
        case "Turismo":
            load_turismo(ui.toPage);
        break
        case "Diversion":
            load_diversion(ui.toPage);
        break
        case "Festivales":
            load_festivales(ui.toPage);
        break
        case "newbacklog":
            //....
            if (!newbacklogBinded) {
                newbacklogBinded = true;
                $("#btnNewStory").on("click", btnNewStory_onclicked);
            }
            break;
        case "detalleLugar":
            if (selectedBacklogItemID !== "") {
                load_detalle(ui.toPage);
            }
            if(!btnTegBinded){
              btnTegBinded=true;
              $("#btnRegTeg").on("click", rescomment);

            }

            break;
        case "picUpload":
            if (!uploadBtnBinded) {
                uploadBtnBinded = true;
                $("#userpic").on("change", userpic_onchange);
                $("#btnUploadPic").on("click", btnUpload_onClicked);
            }
            break;
        case "login":
            if(!btnloginBinded){
                btnloginBinded = true;
                $("#btnLgnIn").on("click", btnLgnIn_onclick);
            }
            break;
        case "register":
            if(!btnRegisterBinded){
                btnRegisterBinded = true;
                $("#btnRegLgn").on("click", btnRegLgn_onclick);
            }
            break;
      case "log_out":
            func_logout();
      break
    }
});


function load_backlog_data(backlog_page) {
    showLoading();

    $.get(
        "/api/getbacklog", {},
        function(docs, success, xhr) {

            if (docs) {
              console.log(docs);
              for (var i = 0; i < docs.length; i++) {
                  backlogitem = docs[i];
                }

                var htmlstr = '<br><br>        <h2>' + backlogitem.user_name + '</h2><br><ul>';
                for (var i = 0; i < docs.length; i++) {
                    backlogitem = docs[i];
                    htmlstr += '<li><a href="#backlogdetail" data-id="' + backlogitem._id + '">'  + backlogitem.teg + '</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}


function load_restaurantes(backlog_page) {
    showLoading();

    $.get(
        "/api/getrestaurante", {},
        function(docs, success, xhr) {

            if (docs) {
              console.log(docs);

                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    backlogitem = docs[i];
                    htmlstr += '<li><a href="#detalleLugar" data-id="' + backlogitem._id + '">'  + backlogitem.local + '<br>' + backlogitem.desc + '</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}

function load_turismo(backlog_page) {
    showLoading();

    $.get(
        "/api/geturismo", {},
        function(docs, success, xhr) {

            if (docs) {
              console.log(docs);

                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    backlogitem = docs[i];
                    htmlstr += '<li><a href="#detalleLugar" data-id="' + backlogitem._id + '">'  + backlogitem.local + '<br>' + backlogitem.desc + '</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}


function load_diversion(backlog_page) {
    showLoading();

    $.get(
        "/api/getdiversion", {},
        function(docs, success, xhr) {

            if (docs) {
              console.log(docs);

                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    backlogitem = docs[i];
                    htmlstr += '<li><a href="#detalleLugar" data-id="' + backlogitem._id + '">'  + backlogitem.local + '<br>' + backlogitem.desc + '</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}


function load_festivales(backlog_page) {
    showLoading();

    $.get(
        "/api/getfetival", {},
        function(docs, success, xhr) {

            if (docs) {
              console.log(docs);

                var htmlstr = '<ul>';
                for (var i = 0; i < docs.length; i++) {
                    backlogitem = docs[i];
                    htmlstr += '<li><a href="#detalleLugar" data-id="' + backlogitem._id + '">'  + backlogitem.local + '<br>' + backlogitem.desc + '</a></li>';
                }
                htmlstr += '</ul>';
                $(backlog_page)
                    .find("#backlog_container")
                    .html(htmlstr)
                    .find("ul")
                    .listview()
                    .find("a")
                    .click(function(e) {
                        selectedBacklogItemID = $(this).data("id");
                    });
            }
            hideLoading();
        },
        "json"
    );
}


function func_logout(){
  showLoading();

  $get("/api/logout",{},function(doc, status, xhr){
      change_page("login");

  },"json");
}

function load_detalle(backlogitem_page) {
  showLoading();

  $.get(

      "/api/getDetalle/" + selectedBacklogItemID, {},
      function(docs, success, xhr) {

          if (docs) {

              var htmlstr = '<br><br>        <h2>' + docs[0].local + '</h2><br><ul>';
              htmlstr += '<li><a data-id="' + docs[0]._id + '">'  + docs[0].desc + '</a></li>';
              htmlstr += '</ul>';
              $(backlogitem_page)
                  .find("#backlog_container")
                  .html(htmlstr)
                  .find("ul")
                  .listview()
                  .find("a")
                  .click(function(e) {
                      selectedBacklogItemID = $(this).data("id");
                  });
          }
          hideLoading();
      },
      "json"
  );
}

function btnNewStory_onclicked(e) {
    e.preventDefault();
    e.stopPropagation();
    //Primer obtener los datos del formulario
    var formValuesArray = $("#newbacklog_form").serializeArray();
    var formObject = {};
    for (var i = 0; i < formValuesArray.length; i++) {
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    showLoading();
    $.post(
        "api/addtobacklog",
        formObject,
        function(data, sucess, xhr) {
            hideLoading();
            if (data.resultado.ok) {
                $("#newbacklog_form").get()[0].reset();
                alert("Historia Ingresada!");
                change_page("backlog");
            } else {
                alert("Error al Insertar!");
            }
        },
        "json"
    ).fail(function(xhr, failtxt, data) {
        hideLoading();
        alert("Error al Insertar!");
    });
}

function userpic_onchange(e) {
    picFile = e.target.files;
    var htmlstr = "";
    htmlstr += "<span><b>Size:</b> ~" + Math.ceil(picFile[0].size / 1024) + "kb </span><br/>";
    htmlstr += "<span><b>Type:</b> " + picFile[0].type + " </span><br/>";
    $("#picMsg").html(htmlstr);
}

function btnUpload_onClicked(e) {
    e.preventDefault();
    e.stopPropagation();
    if (picFile) {
        var formBody = new FormData();
        $.each(picFile, function(llave, valor) {
            formBody.append("userpic", valor);
        });
        formBody.append("backlogid", selectedBacklogItemID);
        showLoading();
        $.ajax({
            url: "api/upload",
            type: "POST",
            data: formBody,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, success, xhr) {
                $("#frm_upload").get()[0].reset();
                hideLoading();
                change_page("backlogdetail");
            },
            error: function(xhr, fail, data) {
                hideLoading();
                alert("Error while uploading evidence file. Try again latter!");
            }
        });
    } else {
        alert("Must select an evidence file!");
    }
}

function btnLgnIn_onclick(e){
    e.preventDefault();
    e.stopPropagation();
    var formValuesArray = $("#frm_login").serializeArray();
    var formObject = {};
    for (var i = 0; i < formValuesArray.length; i++) {
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    $.post("api/login",
        formObject,
        function(data,success,xhr){
            $("#frm_login").get()[0].reset();
            change_page("backlog");
        },
        "json"
    ).fail(function(xhr,fail,data){
        alert("Log In Failed! Try Again");
    });
}

function rescomment(e){
  e.preventDefault();
  e.stopPropagation();
  var formValuesArray = $("#reg_comentario").serializeArray();
  var formObject = {};
  for (var i = 0; i < formValuesArray.length; i++) {
      formObject[formValuesArray[i].name] = formValuesArray[i].value;
  }
  $.post("api/regTeg/"+ selectedBacklogItemID,
      formObject,
      function(data,success,xhr){
          $("#reg_comentario").get()[0].reset();
          change_page("backlog");
      },
      "json"
  ).fail(function(xhr,fail,data){
      alert("Sign Up Failed! Try Again");
  });
}

function btnRegLgn_onclick(e){
    e.preventDefault();
    e.stopPropagation();
    var formValuesArray = $("#frm_register").serializeArray();
    var formObject = {};
    for (var i = 0; i < formValuesArray.length; i++) {
        formObject[formValuesArray[i].name] = formValuesArray[i].value;
    }
    $.post("api/register",
        formObject,
        function(data,success,xhr){
            $("#frm_register").get()[0].reset();
            change_page("login");
        },
        "json"
    ).fail(function(xhr,fail,data){
        alert("Sign Up Failed! Try Again");
    });
}

// Funcion para cambiar de pagina
function change_page(to) {
    $(":mobile-pagecontainer").pagecontainer("change", "#" + to);
}

function showLoading(){
    $.mobile.loading( 'show');
}
function hideLoading(){
    $.mobile.loading( 'hide');
}
