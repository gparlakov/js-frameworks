//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BattleGame.Server.Data
{
    using System;
    using System.Collections.Generic;
    
    public partial class UnitType
    {
        public UnitType()
        {
            this.Units = new HashSet<Unit>();
        }
    
        public long Id { get; set; }
        public string Value { get; set; }
    
        public virtual ICollection<Unit> Units { get; set; }
    }
}
