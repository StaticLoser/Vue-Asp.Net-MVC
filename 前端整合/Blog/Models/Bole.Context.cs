﻿//------------------------------------------------------------------------------
// <auto-generated>
//     此代码已从模板生成。
//
//     手动更改此文件可能导致应用程序出现意外的行为。
//     如果重新生成代码，将覆盖对此文件的手动更改。
// </auto-generated>
//------------------------------------------------------------------------------

namespace Blog.Models
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class bokeEntities : DbContext
    {
        public bokeEntities()
            : base("name=bokeEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<admins> admins { get; set; }
        public virtual DbSet<articles> articles { get; set; }
        public virtual DbSet<Collect> Collect { get; set; }
        public virtual DbSet<comments> comments { get; set; }
        public virtual DbSet<drafts> drafts { get; set; }
        public virtual DbSet<informs> informs { get; set; }
        public virtual DbSet<Like> Like { get; set; }
        public virtual DbSet<recommends> recommends { get; set; }
        public virtual DbSet<users> users { get; set; }
    }
}
