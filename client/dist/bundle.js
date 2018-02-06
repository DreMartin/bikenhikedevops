$(function () {

      let WorkoutLog = (function ($, undefined) {
            let API_BASE = 'https://bike-n-hike-api.herokuapp.com/api/';
            let userDefinitions = [];

            let setAuthHeader = function (sessionToken) {
                  window.localStorage.setItem('sessionToken', sessionToken);
                  // Set the authorization header
                  // This can be done on individual calls
                  // here we showcase ajaxSetup as a global tool
                  $.ajaxSetup({
                        'headers': {
                              'Authorization': sessionToken
                        }
                  });
            };

            // public
            return {
                  API_BASE: API_BASE,
                  setAuthHeader: setAuthHeader
            };
      })(jQuery);

      // Ensure .disabled aren't clickable
      $('.nav-tabs a[data-toggle="tab"]').on('click', function (e) {
            let token = window.localStorage.getItem('sessionToken');
            if ($(this).hasClass('disabled') && !token) {
                  e.preventDefault();
                  return false;
            }
      });

      // bind tab change events
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            let target = $(e.target).attr('href'); // activated tab
            if (target === '#log') {
                  WorkoutLog.log.setDefinitions();
                  console.log('log button working');
            }

            if (target === '#history') {
                  WorkoutLog.log.setHistory();
            }
      });

      // bind enter key
      $(document).on('keypress', function (e) {
            if (e.which === 13) { // enter key
                  if ($('#signup-modal').is(':visible')) {
                        $('#signup').trigger('click');
                        console.log('clicked');
                  }
                  if ($('#login-modal').is(':visible')) {
                        $('#login').trigger('click');
                  }
            }
      });

      // bind tab change events
      // bootstrap tab --> binding to a bootstrap event
      $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
            var target = $(e.target).attr("href"); // activated tab
            if (target === "#log") {
                  WorkoutLog.log.setDefinitions();
            }

            if (target === "#history") {
                  WorkoutLog.log.setHistory();
            }

            if (target === "#update-log") {
                  WorkoutLog.log.setDefinitions();
            }
      });

      // setHeader if we
      let token = window.localStorage.getItem('sessionToken');
      if (token) {
            WorkoutLog.setAuthHeader(token);
      }

      // expose this to the other workoutlog modules
      window.WorkoutLog = WorkoutLog;


});





// $(function(){

//    let WorkoutLog = (function($, undefined) {
//          let API_BASE = 'http://localhost:3000/api/';
//          let userDefinitions = [];

//          let setAuthHeader = function(sessionToken) {
//             window.localStorage.setItem('sessionToken', sessionToken);
//             // Set the authorization header
//             // This can be done on individual calls
//             // here we showcase ajaxSetup as a global tool
//             $.ajaxSetup({
//                'headers': {
//                   'Authorization': sessionToken
//                }
//             });
//          };

//          // public
//          return {
//             API_BASE: API_BASE,
//             setAuthHeader: setAuthHeader
//          };
//       })(jQuery);

//       // Ensure .disabled aren't clickable
//       $('.nav-tabs a[data-toggle="tab"]').on('click', function(e) {
//          let token = window.localStorage.getItem('sessionToken');
//          if ($(this).hasClass('disabled') && !token) {
//             e.preventDefault();
//             return false;
//          }
//       });

//       // bind tab change events
//       $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//          let target = $(e.target).attr('href'); // activated tab
//          if (target === '#log') {
//             WorkoutLog.log.setDefinitions();
//          }

//          if (target === '#history') {
//             WorkoutLog.log.setHistory();
//          }
//       });

//       // bind enter key
//       $(document).on('keypress', function(e) {
//          if (e.which === 13) { // enter key
//             if ($('#signup-modal').is(':visible')) {
//                $('#signup').trigger('click');
//             }
//             if ($('#login-modal').is(':visible')) {
//                $('#login').trigger('click');
//             }
//          }
//       });
//       // setHeader if we
//       let token = window.localStorage.getItem('sessionToken');
//       if (token) {
//          WorkoutLog.setAuthHeader(token);
//       }

//       // expose this to the other workoutlog modules
//       window.WorkoutLog = WorkoutLog;


// });
$(function () {
    $.extend(WorkoutLog, {
        definition: {
            userDefinitions: [],

            create: function () {
                console.log('create was called');
                var def = {
                    desc: $("#def-description").val(),
                    type: $("#def-logtype").val()
                };
                var postData = {
                    definition: def
                };
                var define = $.ajax({
                    type: "POST",
                    url: WorkoutLog.API_BASE + "definition",
                    data: JSON.stringify(postData),
                    contentType: "application/json"
                });

                define.done(function (data) {
                    WorkoutLog.definition.userDefinitions.push(data.definition);
                    console.log(data.definition);

                    $("#def-description").val("");
                    $("#def-logtype").val("");
                    $('a[href="#log"]').tab("show");
                    

                });
            },

            fetchAll: function () {
                var fetchDefs = $.ajax({
                        type: "GET",
                        url: WorkoutLog.API_BASE + "definition",
                        headers: {
                            "authorization": window.localStorage.getItem("sessionToken")
                        }
                    })
                    .done(function (data) {
                        WorkoutLog.definition.userDefinitions = data;
                    })
                    .fail(function (err) {
                        console.log(err);
                    });
            }

        }
    });


    console.log('shit\'s working' /*WorkoutLog.definition.create*/ )
    // bindings
    $("#def-save").on("click", WorkoutLog.definition.create);


    // fetch definitions if we already are authenticated and refreshed
    if (window.localStorage.getItem("sessionToken")) {
        WorkoutLog.definition.fetchAll();
    }

});
$(function () {
    $.extend(WorkoutLog, {
        log: {
            workouts: [],

            setDefinitions: function () {
                var defs = WorkoutLog.definition.userDefinitions;
                var len = defs.length;
                var opts;
                for (var i = 0; i < len; i++) {
                    opts += "<option value='" + defs[i].id + "'>" + defs[i].description + "</option>";
                }
                $("#log-definition").children().remove();
                $("#log-definition").append(opts);
                $("#update-definition").children().remove();
                $("#update-definition").append(opts);
            },

            setHistory: function () {
                var history = WorkoutLog.log.workouts;
                var len = history.length;
                var lis = "";
                for (var i = 0; i < len; i++) {
                    lis += "<li class='list-group-item'>" +
                        history[i].def + " - " +
                        history[i].result + " " +
                        // pass the log.id into the button's id attribute
                        "<div class='pull-right'>" +
                        "<button id='" + history[i].id + "' class='update'><strong>U</strong></button>" +
                        "<button id='" + history[i].id + "' class='remove'><strong>X</strong></button>" +
                        "</div></li>";
                }

                $("#history-list").children().remove();
                $("#history-list").append(lis);
            },

            create: function () {
                var itsLog = {
                    desc: $("#log-description").val(),
                    result: $("#log-result").val(),
                    def: $("#log-definition option:selected").text()
                };
                var postData = {
                    log: itsLog
                };
                var logger = $.ajax({
                    type: "POST",
                    url: WorkoutLog.API_BASE + "log",
                    data: JSON.stringify(postData),
                    contentType: "application/json"
                });

                logger.done(function (data) {
                    WorkoutLog.log.workouts.push(data);
                    console.log(WorkoutLog.log.workouts);

                    $("#log-description").val("");
                    $("#log-result").val("");
                    $('a[href="#history"]').tab("show");

                });
            },

            getWorkout: function () {
                var thisLog = {
                    id: $(this).attr("id")
                };
                console.log(thisLog);
                logID = thisLog.id;
                var updateData = {
                    log: thisLog
                };
                console.log(logID);

                var getLog = $.ajax({
                    type: 'GET',
                    url: WorkoutLog.API_BASE + "log/" + logID,
                    data: JSON.stringify(updateData),
                    contentType: "application/json"
                });

                getLog.done(function (data) {
                    $('a[href="#update-log"]').tab("show");
                    $('#update-result').val(data.result);
                    $('#update-description').val(data.description);
                    $('#update-id').val(data.id);
                });
                
            },

            updateWorkout: function() {
                $("#update").text("Update");
                var updateLog = {
                    id: $('#update-id').val(),
                    desc: $('#update-description').val(),
                    result: $('#update-result').val(),
                    def: $("#update-definition option:selected").text()
                };
                console.log(updateLog.id);

                for (var i = 0; i < WorkoutLog.log.workouts.length; i++) {
                    if (WorkoutLog.log.workouts[i].id == updateLog.id) {
                        WorkoutLog.log.workouts.splice(i, 1);
                    }
                }
                WorkoutLog.log.workouts.push(updateLog);
                var updateLogData = {
                    log: updateLog
                };
                var updater = $.ajax({
                    type: 'PUT',
                    url: WorkoutLog.API_BASE + "log",
                    data: JSON.stringify(updateLogData),
                    contentType: "application/json"
                });

                updater.done(function(data) {
                    console.log(data);
                    $("#update-description").val("");
                    $("#update-result").val("");
                    $('a[href="history"]').tab("show");
                });
            },


            delete: function () {
                var thisLog = {
                    //"this" is the button on the li
                    //.attr("id") targets the value of the id attribute of button
                    id: $(this).attr("id")
                };
                var deleteData = {
                    log: thisLog
                };
                var deleteLog = $.ajax({
                    type: "DELETE",
                    url: WorkoutLog.API_BASE + "log",
                    data: JSON.stringify(deleteData),
                    contentType: "application/json"
                });

                // removes list item
                // references button then grabs closest li

                $(this).closest("li").remove();

                // deletes item out of workouts array

                for (var i = 0; i < WorkoutLog.log.workouts.length; i++) {
                    if (WorkoutLog.log.workouts[i].id == thisLog.id) {
                        WorkoutLog.log.workouts.splice(i, 1);
                    }
                }
                deleteLog.fail(function () {
                    console.log("nope.You didnt delete it");
                });
            },

            fetchAll: function () {
                var fetchDefs = $.ajax({
                        type: "GET",
                        url: WorkoutLog.API_BASE + "log",
                        headers: {
                            "authorization": window.localStorage.getItem("sessionToken")
                        }
                    })
                    .done(function (data) {
                        WorkoutLog.log.workouts = data;
                    })
                    .fail(function (err) {
                        console.log(err);
                    });
            }
        }
    });

    //Click the button and create a log entry.
    $("#log-save").on("click", WorkoutLog.log.create);
    $("#history-list").delegate('.remove', 'click', WorkoutLog.log.delete);

    //click the button and update a Log entry
    $("#log-update").on("click", WorkoutLog.log.updateWorkout);
    $("#history-list").delegate('.update', 'click', WorkoutLog.log.getWorkout);


    if (window.localStorage.getItem("sessionToken")) {
        WorkoutLog.log.fetchAll();
    }
    // ^^^^All code above the closing^^^^
});
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