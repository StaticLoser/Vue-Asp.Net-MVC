using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Blog.Models;

namespace Blog.Controllers
{
    public class UserController : ApiController
    {
        [HttpPost]
        public IHttpActionResult UpInfo(users u)
        {
            if (u == null)
            {
                return NotFound();
            }
            using (bokeEntities db = new bokeEntities())
            {
                db.Entry(u).State = EntityState.Modified;
                int code = 0;
                string message = "修改失败";
                if (db.SaveChanges() > 0)
                {
                    code = 200;
                    message = "修改成功";
                }
                return Json(new { code = code, message = message });
            }
        }
    }
}
