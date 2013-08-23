/// <reference path="../lib/require.js" />
/// <reference path="../lib/class.js" />

define(
    ["http-requester",
    "class"], 

    function (requester, Class) {
        var Persister = Class.create({
            baseUrl: "",
            students:{},
            init: function(baseUrl){
                this.baseUrl = baseUrl;
                this.students = new StudentsPersister(baseUrl);
            }
        });

        var StudentsPersister = Class.create({
            serviceUrl: "",
            init: function (baseUrl) {
                this.serviceUrl = baseUrl + "students";
            },
            all: function () {
                return requester.getJSON(this.serviceUrl);
            }            
        });
        
    return {
        getPersister: function (baseUrl) {
            return new Persister(baseUrl);
        }
    }
});