/// <reference path="http://localhost:58674/Scripts/underscore.js" />
/// <reference path="http://localhost:58674/Scripts/class.js" />
http://localhost:58674/Scripts/underscore.min.map

;var students = (function () {

    var Student = Class.create({
        init: function (fname, lname) {
            this.fname = fname;
            this.lname = lname;
        },
        toString: function () {
            return this.fname + " " + this.lname;
        }
    });

    var students = [
        new Student("Dobri", "Chintulov"),
        new Student("Zahari", "Stoqnov"),
        new Student("Nikola", "Petkov"),
        new Student("Dimitar", "Petkov"),
        new Student("Chudomir", "Chudomir")];    

    return students;
})()

var firstBeforaLastName = _.filter(students, function (student) {
    return student.fname < student.lname;
});

_.each(firstBeforaLastName, function (stud) {
    console.log(stud.toString());
});
