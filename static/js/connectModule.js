var app = angular.module('connectApp', []);

app.controller('connectController', function($scope, $http){
    $scope.connections=[];
    $scope.recipient_id = '';
    $scope.showing = false;
    $scope.recipient_id = 0;
    $scope.recipient_name = '';

    $('.vertical.pointing.menu a').click(function() {
        var classes = $(this).attr('class').split(' ');
        var isActive = false;
        var isFind = false;
        var find = $(this).data('tab');
        console.log(find);
        if (find !== 'recommended') {
            if ($scope.showing != true) {
                $('#results').transition('fly up');
                $scope.showing = true;
            } else {
                $('#results').transition('horizontal flip', '500ms')
                    .transition('horizontal flip', '500ms');
            }
            if (find === 'get-help') {
                isFind = true;
            }
            if (isFind) {
                $scope.get_connect_post(true);
            } else {
                $scope.get_connect_post(false);
            }
        } else {
            if ($scope.showing == true) {
                $('#results').transition('fly up');
            }
            $scope.showing = false;
        }
    });

    $('#get-connect select').on('change', function(event) {
        event.preventDefault();
        $scope.get_connect_post(true);
    });

    $('#give-connect select').on('change', function(event) {
        event.preventDefault();
        $scope.get_connect_post(false);
    });

    $scope.makeMessage = function(id, name){
        $('#message-response').empty();
        $scope.messageResponse = "";
        $('#recipient-id').val(id);
        $('#message-title').html("Message To "+name)
        messageModal = $('.large.modal');
        if (messageModal.modal('is active')) {
            messageModal.modal('hide');
        } else {
            messageModal.modal('show');
        }
    }



    $scope.get_connect_post = function(isGet) {
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
    $.ajax({
        url: "connect", // the endpoint
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
            $scope.connections = data['folks'];
            $scope.$apply();
            $.each($scope.connections, function(index, val){
                $('.ui.accordion').accordion();
            })
            },

        // handle a non-successful response
        error: function(xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
             $scope.connections = "Error retrieving results";
            }

        });
    };



});
