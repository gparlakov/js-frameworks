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
    
    public partial class Unit
    {
        public long Id { get; set; }
        public long PositionX { get; set; }
        public long PositionY { get; set; }
        public long Attack { get; set; }
        public long HitPoints { get; set; }
        public long Armor { get; set; }
        public long Range { get; set; }
        public long Speed { get; set; }
        public long OwnerId { get; set; }
        public long GameId { get; set; }
        public long ModeId { get; set; }
        public long TypeId { get; set; }
    
        public virtual Game Game { get; set; }
        public virtual Mode Mode { get; set; }
        public virtual UnitType UnitType { get; set; }
        public virtual User User { get; set; }
    }
}
