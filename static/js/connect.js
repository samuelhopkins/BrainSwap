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

$('#get-connect select').on('change', function(event) {
    event.preventDefault();
    get_connect_post(true);
});

var showing = false;
$('.vertical.pointing.menu a').click(function() {
    var classes = $(this).attr('class').split(' ');
    var isActive = false;
    var isFind = false;
    var find = $(this).data('tab');
    console.log(find);
    if (find !== 'recommended') {
        if (showing != true) {
            $('#results').transition('fly up');
            showing = true;
        } else {
            $('#results').transition('horizontal flip', '500ms')
                .transition('horizontal flip', '500ms');
        }
        if (find === 'get-help') {
            isFind = true;
        }
        if (isFind) {
            get_connect_post(true);
        } else {
            get_connect_post(false);
        }
    } else {
        if (showing == true) {
            $('#results').transition('fly up');
        }
        showing = false;
    }
});

var id = 0;

$('#give-connect select').on('change', function(event) {
    event.preventDefault();
    get_connect_post(false);
});

function populateConnect(data) {
    $('#connect-results').empty();
    if (data['folks'].length == 0) {
        $('#connect-results').append('<p>No results matched your search</p>');
    }
    $.each(data["folks"], function(index, value) {
        console.log(value);
        var student = $('<div>').addClass('ui item container segment padded');
        var name_block = $('<div class="column"><h3><i class="circular user icon"></i>' + value['name'] + '</h3></div>');
        var grid = $('<div class = "ui equal width grid">')
        var row = $('<div class="row">');
        var message_block = $('<div class="column"><div data-value="' + value['id'] + '" class="ui right floated vertical animated button"><div class="hidden content">Message</div><div class="visible content"><i class="mail icon"></i></div></div></div>')
        var summary = $('<div>').addClass('ui accordion');
        var sum_inner = $('<div>').addClass('title').html('<i class="dropdown icon"></i>Read Summary');
        var content = $('<div>').addClass('content');
        var content_par = $('<p>').text(value['summary']);
        var content_extend = content.append(content_par);
        var accordion = summary.append(sum_inner).append(content_extend);
        var action_row = grid.append(row.append(name_block).append(message_block));
        student.append(action_row).append(summary);
        $('#connect-results').append(student);
        $('.ui.accordion').accordion();
        watchClick();
        watchMessage();
    });
}

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

function get_connect_post(isGet) {
    csrftoken = $('input[name=csrfmiddlewaretoken]').val();
    if (isGet === true) {
        context = {
            majors: $('.getMajors').dropdown('get value'),
            subjects: $('.profs').dropdown('get value'),
            isGet: isGet
        };
    } else {
        context = {
            majors: $('.giveMajors').dropdown('get value'),
            subjects: $('.defs').dropdown('get value'),
            isGet: isGet
        };
    }
    console.log(context);
    $.ajax({
        url: "../connect/", // the endpoint
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
            console.log(data['folks']);
            populateConnect(data);
        },

        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });
};

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