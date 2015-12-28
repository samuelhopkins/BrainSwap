$(document).ready(function() {
    watchClick();
    watchMessage();
    $('.ui.accordion').accordion();
    $('.vertical.pointing.menu .item').tab();
    $('.ui.dropdown').dropdown();
});

var body = document.body;
function disableBodyScroll() {
    body.style.overflowY = 'hidden';
}
function enableBodyScroll() {
    body.style.overflowY = 'auto';
}

$('#results').transition('hide');
$('.large.modal').modal(
    'setting', {
        onShow: function() {
            $(this).css({
                'background-color': 'grey',
            });
        },
        onHide: function() {
            $('#message-send').removeClass('disabled');
            $('#message-body').val("");
        },
    }).modal('hide');

var id = 0;


function messageResponse(data) {
    console.log(data);
    $('#message-response').text(data['message']);
    if (data['success'] == false) {
        $('#message-send').removeClass('disabled');
    }
}


function watchClick() {
    $('.animated.button').click(function() {
        $('#message-response').empty();
        id = $(this).data('value');
        var name = $(this).data('name');
        $('#message-title').html("Message To "+name)
        messageModal = $('.large.modal');
        $('#recipient-id').val(id);
        if (messageModal.modal('is active')) {
            messageModal.modal('hide');
        } else {
            messageModal.modal('show');
        }
    });
}

function watchMessage() {
    $('#message-send').click(function(event) {
        event.preventDefault();
        $(this).addClass('disabled');
        sendMessage();
    })
}


function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


function sendMessage() {
    console.log($('#message-body').val());
    csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    context = {
        body: $('#message-body').val(),
        id: $('#recipient-id').val()
    };
    $.ajax({
        url: "../message/", // the endpoint
        type: "POST", // http method
        data: context, // data sent with the post request
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        },
        // handle a successful response
        success: function(json) {
            data = $.parseJSON(json);
            messageResponse(data);
        },

        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
}