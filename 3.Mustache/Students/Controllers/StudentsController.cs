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
        public IEnumerable<Student> Get()
        {
            var students = StudentsFactory.GenerateStudents(new Random().Next(20));

            return students;
        }       
    }
}