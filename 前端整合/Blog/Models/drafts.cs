//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class drafts
    {
        public int did { get; set; }
        public int uid { get; set; }
        public string tittle { get; set; }
        public string content { get; set; }
        public string labId { get; set; }
        public Nullable<System.DateTime> create_at { get; set; }
        public Nullable<System.DateTime> update_at { get; set; }
    
        public virtual users users { get; set; }
    }
}
