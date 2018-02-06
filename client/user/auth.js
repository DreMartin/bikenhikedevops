$(function () {
    $.extend(WorkoutLog, {
            //signup method
            signup: function () {
                //username & password variables. 
                var username = $("#su_username").val();
                var password = $("#su_password").val();
                //user object
                var user = {
                    user: {
                        username: username,
                        password: password
                    }
                };

                //signup post 
                var signup = $.ajax({
                    type: "POST",
                    url: WorkoutLog.API_BASE + "user",
                    data: JSON.stringify(user),
                    contentType: "application/json"
                });

                //signup done/fail
                signup.done(function (data) {
                        if (data.sessionToken) {
                            WorkoutLog.setAuthHeader(data.sessionToken);
                            console.log('It works');
                            console.log(data.sessionToken);
                        }

                        if (data.sessionToken) {
                            WorkoutLog.setAuthHeader(data.sessionToken);
                            WorkoutLog.definition.fetchAll();
                            WorkoutLog.log.fetchAll();

                            //remove after test
                            console.log('success');
                            console.log(data);
                        }

                        $("#signup-modal").modal("hide");
                        $(".disabled").removeClass("disabled");
                        $("#loginout").text("Logout");
                        $("#su_username").val("");
                        $("#su_password").val("");
                        $('a[href="#define"]').tab("show");

                        //routing
                        $('a[href="#define"]').tab('show');

                    })
                    .fail(function () {
                        $("#su_error").text("There was an issue with sign up").show();
                    });

            },


            //login method
            login: function () {

                //login variables
                var username = $("#li_username").val();
                var password = $("#li_password").val();
                var user = {
                    user: {
                        username: username,
                        password: password
                    }
                };

                // login POST
                var login = $.ajax({
                    type: "POST",
                    url: WorkoutLog.API_BASE + "login",
                    data: JSON.stringify(user),
                    contentType: "application/json"
                });


                //login done/fail
                login.done(function (data) {
                    if (data.sessionToken) {
                        WorkoutLog.setAuthHeader(data.sessionToken);
                    }

                    
                    if (data.sessionToken) {
                        WorkoutLog.setAuthHeader(data.sessionToken);
                        WorkoutLog.definition.fetchAll();
                        WorkoutLog.log.fetchAll();
                    }
                    
                    //TODO: add loginc to set user and auth token
                    $("#login-modal").modal("hide");
                    $(".disabled").removeClass("disabled");
                    $("#loginout").text("Logout");

                    $("#li_username").val("");
                    $("#li_password").val("");
                    $('a[href="#define"]').tab("show");

                }).fail(function () {
                    $("#li_error").text("There was an issue with sign up").show();
                });
            },


            loginout: function () {
                if (window.localStorage.getItem("sessionToken")) {
                    window.localStorage.removeItem("sessionToken");
                    window.location.reload();
                    $("#loginout").text("Login");
                }

                // TODO: on logout make sure stuff is disabled
            }
        },

    );

    //bind events
    $("#signup").on("click", WorkoutLog.signup);
    $("#login").on("click", WorkoutLog.login);
    $("#loginout").on("click", WorkoutLog.loginout);

    if (window.localStorage.getItem("sessionToken")) {
        $("#loginout").text("Logout");
    }

});