using Students.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Students
{
    public static class StudentsFactory 
    {
        private static string[] FirstNames = new string[] { "Petar", "Georgi", "Stamat", "Nikola", "Milena", "Mariqna", "Minka", "Siqna" };
        private static string[] LastNames = new string[] { "Petrov", "Georgiev", "Stamatiev", "Nikolaev", "Milenova", "Mariqnova", "Minkova", "Siqnaowa" };
        private static string[] SubjectNames = new string[] {"HTML", "JS Part I", "CSS", "JS Part II", "C# part I", "C# part II", "DataBases", "Algorithms and DataStructures", "JavaScriptApps", "Web Services" };
        private static Random rand = new Random();

        public static Student GenerateStudent() 
        {
            var firstName = FirstNames[rand.Next(FirstNames.Length)];
            var lastName = LastNames[rand.Next(LastNames.Length)];

            var age = rand.Next(7, 18);
            var grade = age - 6;

            var marksCount = rand.Next(10);
            var marks = new List<Mark>();
            for (int i = 0; i < marksCount; i++)
            {
                var subject = SubjectNames[rand.Next(SubjectNames.Length)];
                if (!marks.Any(m => m.Subject == subject))
                {
                    marks.Add(new Mark
                    {
                        Subject = subject,
                        Value = Math.Round((rand.NextDouble() * 6), 2)
                    });
                }
                else
                {
                    i--;
                }
            }

            marks = marks.OrderBy(m => m.Subject).ToList();

            var newStudent = new Student 
            {
                FirstName = firstName,
                LastName = lastName,
                Age = age,
                Grade = grade,
                Marks = marks
            };

            return newStudent;
        }

        public static IEnumerable<Student> GenerateStudents(int count)
        {
            var students = new List<Student>();
            for (int i = 0; i < count; i++)
            {
                var student = GenerateStudent();
                student.Id = i;
                students.Add(student);
            }

            return students;
        }
    }
}