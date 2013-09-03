/// <reference path="data.js" />
var bank = bank || {};

bank.viewModels = (function () {
    var data = bank.dataPersister.get("nlLzudTqMoYl1WOz");

    var getLoginViewModel = function () {
        return new kendo.observable({
            username: "",
            displayName: "",
            password: "",
            loginClass: "visible",
            registerClass: "hidden",
            login: function () {
                var user = {
                    username: this.username,
                    password: this.password
                }
                var self = this;
                data.users.login(user)
                    .then(function (result) {
                        open("#/accounts", "_self");
                    })

            },
            register: function () {
                var user = {
                    username: this.username,
                    password: this.password,
                    DispayName: this.displayName
                }
                var self = this;
                data.users.register(user)
                    .then(function (result) {
                        open("#/accounts", "_self");
                    })
            },
            toggle: function () {
                var login = this.loginClass;
                this.set("loginClass", this.registerClass);
                this.set("registerClass", login);
            },
        });
    }

    var getAccountsListVM = function () {
        return new kendo.observable({
            accounts: [],
            newAccountName:"",
            addNew: function () {
                var newAccount = {
                    Name: this.newAccountName,
                    Balance: 0,
                }

                data.accounts.create(newAccount);
            },
            init: function () {
                var self = this;

                data.accounts.getAll()
                    .then(function (response) {
                        self.set("accounts", response.result);
                    });
            }
        })
    }

    return {
        login: getLoginViewModel,
        accountsList: getAccountsListVM
    }
}())