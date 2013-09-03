/// <reference path="lib/kendo.all.min.js" />
/// <reference path="lib/kendo.all.min.intellisense.js" />
/// <reference path="app/data.js" />
/// <reference path="app/viewModels.js" />
/// <reference path="app/views.js" />

(function () {
    var router = new kendo.Router();
    var viewModels = bank.viewModels;
    var views = bank.views;
    var layout;

    var initLayout = function () {        
        views.layout()
            .then(function (layOutHtml) {
                layout = new kendo.Layout(layOutHtml);

                layout.render($("#application"));

                router.start();
            });
    }
    
    router.route("/", function () {
        router.navigate("/home");
    })

    router.route("/home", function () {
        
    });

    router.route("/login", function () {
        views.loginRegister()
            .then(function (loginHtml) {
                var loginVM = viewModels.login();
                var view = new kendo.View(loginHtml, { model: loginVM });
                layout.showIn("#main-content", view);
            });
    });

    router.route("/about", function () {
        views.about()
            .then(function (result) {
                var view = new kendo.View(result)
                layout.showIn("#main-content", view);
            })
    });

    router.route("/accounts", function () {
        views.accountsList()
            .then(function (accountsHtml) {
                var accountsVM = viewModels.accountsList();
                accountsVM.init();
                var view = new kendo.View(accountsHtml, { model: accountsVM });

                layout.showIn("#main-content", view);
            })
    });

    router.route("/accounts/:id", function (id) {

    });

    $(function () {
        initLayout();
    })
})();
