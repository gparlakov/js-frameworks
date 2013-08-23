using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Students.Models
{
    public class Student
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("fname")]
        public string FirstName { get; set; }

        [JsonProperty("lname")]
        public string LastName { get; set; }

        [JsonProperty("grade")]
        public int Grade { get; set; }

        [JsonProperty("age")]
        public int Age { get; set; }

        [JsonProperty("marks")]
        public ICollection<Mark> Marks { get; set; }
    }
}