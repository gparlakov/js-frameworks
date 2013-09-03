/// <reference path="../lib/jquery-2.0.3.js" />
/// <reference path="../lib/rsvp.min.js" />
var bank = bank || {}

bank.views = (function () {
    var templates = {};

    var getTemplate = function(template){
        return new RSVP.Promise (function(resolve, reject) {
            if (templates[template]) {
                resolve(templates[template]);
            }
            else{
                var url = "partialHtml/" + template + ".html";

                $.get(url)
                    .success(function(partialHTML){
                        resolve(partialHTML);
                    })
                    .fail(function (err) {
                        reject(err);
                    });
            }
        });
    }

    var getLayout = function () {
        return getTemplate("layout");
    }

    var getAbout = function () {
        return getTemplate("about");
    }

    var getLoginRegisterForm = function () {
        return getTemplate("login-register-form");
    }

    var getAccountsListView = function () {
        return getTemplate("accounts");
    }

    return {
        layout:getLayout,
        about: getAbout,
        loginRegister: getLoginRegisterForm,
        accountsList: getAccountsListView
    }
}())