using Students.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Students.Controllers
{
    public class StudentsController : ApiController
    {
        //
        // GET api/values
        public HttpResponseMessage Get()
        {
            var students = StudentsFactory.GenerateStudents(new Random().Next(20));

            //return students;

            var msg = this.Request.CreateResponse(HttpStatusCode.OK, students);
            msg.Headers.Add("Access-Control-Allow-Origin", "*");

            return msg;
        }       
    }
}