/// <reference path="lib/require.js" />
/// <reference path="lib/jquery-2.0.3.js" />
/// <reference path="lib/jquery-2.0.3.intellisense.js" />
/// <reference path="lib/http-requester.js" />
/// <reference path="lib/class.js" />
/// <reference path="lib/mustache.js" />
/// <reference path="lib/rsvp.min.js" />
/// <reference path="app/views.js" />

;(function () {
    require.config({
        paths: {
            jquery: "lib/jquery-2.0.3",           
            "class": "lib/class",
            mustache: "lib/mustache",
            rsvp: "lib/rsvp.min",
            "http-requester": "lib/http-requester",
            persister: "app/data-persister",
            view: "app/view",                       
        }
    });

    require(["jquery", "mustache", "persister", "view"], //
        function ($, mustache, persister, views) {
            var dataPersisiter = persister.getPersister("http://localhost:63470/api/");

            var mainContent = $("#content");
            var marks = $("#marks").toggleClass("hidden");

            var studentTemplate = mustache.compile($("#student-template").html());
            var markTemplate = mustache.compile($("#mark-template").html());

            var data = {};

            dataPersisiter.students.all()
                .then(function (students) {
                    data = students;
                    
                    var comboBoxView = views.getComboBoxView("#content", students);
                    comboBoxView.render(studentTemplate);                    
                },
                onError);

            function getStudentsMarks(id) {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id === id) {
                        return data[i].marks;
                    }
                }
            }

            function onError(err) {
                var message = "An error occured:\n";
                if (err.message) {
                    message += err.message + "\n";
                }
                if (err.statusText) {
                    message += err.statusText + "\n";
                }
            }
        },

        // on require error
        function onErr(err) {
            alert("A require.js error occured - check console for more info.");
            console.log(err);
        }
    );
})()


//mainContent.on("click", "div.student-element", function () {
//    var id = $(this).data("student-id");

//    var studentMarks = getStudentsMarks(id);

//    var marksHtml = markTemplate(studentMarks);

//    marks.html(marksHtml);

//    togglePage();
//});

//marks.on("click", "#back-to-students", function () {
//    togglePage();
//});

//function togglePage() {
//    mainContent.toggleClass("hidden");
//    marks.toggleClass("hidden");
//}
