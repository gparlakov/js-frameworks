using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Students.Models
{
    public class Mark
    {
        [JsonProperty("subject")]
        public string Subject { get; set; }

        [JsonProperty("value")]
        public double Value { get; set; }
    }
}