$(document).ready(function(){
    $("#loginForm").submit(function(event){
        event.preventDefault();
        ajaxPost();
    });

    function ajaxPost(){
        var userData = {
            userEmail : $("#userEmail").val(),
            userPassword: $("#userPassword").val()
        }

        $.ajax({
            type : "POST",
            contentType : "application/json",
            url: "/api/login",
            data: JSON.stringify(userData),
            processData: false,
            dataType: 'json',
            success : function(user) {
                if (user.ok == true){
                    $("#login").addClass("hide");
                    $("#login").removeClass("show");
                    $("#welcome").addClass("show");
                    $("#welcome").removeClass("hide");
                    $("#error").removeClass("show");
                    $("#error").addClass("hide");
                    $("#welcome").html("<h2>Welcome " + user.userName + "</h2>")
                } else {
                    $("#login").removeClass("hide");
                    $("#login").addClass("show");
                    $("#welcome").addClass("hide");
                    $("#welcome").removeClass("show");
                    $("#error").removeClass("hide");
                    $("#error").addClass("show");
                }
                
            },
            error:function(e){
                alert("Error!");
                console.log("Error: ", e);
            }
        });
        reset();
    }

    function reset(){
        $("#userEmail").val("");
        $("#userPassword").val("");
    }
});