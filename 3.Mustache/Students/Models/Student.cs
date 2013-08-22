using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Students.Models
{
    public class Student
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        //public int Id { get; set; }
        public int Grade { get; set; }
        public int Age { get; set; }
        public ICollection<Mark> Marks { get; set; }
    }
}