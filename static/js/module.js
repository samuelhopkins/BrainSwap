
var app = angular.module('messageApp', []).config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});
app.controller('messageController', function($scope, $window, $http){
// $interpolateProvider.startSymbol('{$');
//     $interpolateProvider.endSymbol('$}');
    $('.menu .item').tab();
    $('.ui.dropdown').dropdown();
    $scope.message = "";
    $scope.loaded = false;
    $scope.title = "";
    $scope.recipient = "";
    $scope.recipient_name="";
    $scope.closeMessageText = 'Cancel';
    $scope.inBox = [];
    $scope.outBox = [];
    $scope.reply = false;
    $scope.init = true;

    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        }

    $scope.populateBoxes = function(){
        $http.get('inbox').success(function(data, status){
        console.log(data);
        $scope.inBox = data['inbox'];
        $scope.outBox = data['outbox'];
        $scope.loaded = true;
        // if ($scope.inBox.length > 0 && $scope.init == true){
        //     var message = $scope.inBox[0]
        //     $scope.recipient = message.user_id;
        //     $scope.recipient_name = message.sender;
        //     $scope.title = 'From: ' + message.sender;
        //     $scope.message = message.content;
        //     $scope.init = false;
        // };
        })
        .error(function(data, status){
        console.log("error");
        });
    };
    $scope.populateBoxes();

    $scope.sendMessage = function(){
        csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        data = {id : $scope.recipient, body : $scope.newMessage};
        $.ajax({
            url : 'message',
            type : "POST",
            data: data,
            beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(json) {
            data = $.parseJSON(json);
            if (data['success'] == true){
                $scope.populateBoxes();
                $scope.newMessage = data['message'];
                $scope.$apply();
            };
            },
            error: function(xhr, errmsg, err) {
                $scope.newMessage = "There was an error sending your message.";
                $scope.$apply();
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    }

    $scope.deleteMessage = function(inbox,index){
        console.log(index);
        if(inbox == true){
        var message = $scope.inBox[index];
        data = { message_id : message.message_id, inbox : inbox};
        }else{
        var message = $scope.outBox[index];
        data = { message_id : message.message_id, inbox : inbox};
        }
        csrftoken = $('input[name=csrfmiddlewaretoken]').val();

        $.ajax({
            url : 'deleteMessage',
            type : "POST",
            data: data,
            beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(json) {
            data = $.parseJSON(json);
            if (data['success'] == true){
                $scope.populateBoxes();
            };
            },
            error: function(xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    };

    $scope.readMessage = function(index){
        var message = $scope.inBox[index];
        data = { message_id : message.message_id};
        csrftoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
            url : 'readMessage',
            type : "POST",
            data: data,
            beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            },
            success: function(json) {
                console.log("change to read");
            },
            error: function(xhr, errmsg, err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
            }
        });
    }

    $scope.populateInboxMessage = function(index){
        if ($scope.inBox[index].read == false){
        $scope.readMessage(index);
        $scope.inBox[index].read = true;
        }
        var message = $scope.inBox[index]
        $scope.recipient = message.user_id;
        $scope.recipient_name = message.sender;
        $scope.title = 'From: ' + message.sender;
        $scope.message = message.content;
    };

    $scope.populateOutboxMessage = function(index){
        var message = $scope.outBox[index]
        $scope.recipient = message.user_id;
        $scope.recipient_name = message.recipient;
        $scope.title = 'To: ' + message.recipient;
        $scope.message = message.content;
    };
});