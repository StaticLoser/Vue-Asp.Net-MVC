using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Blog.Models;

namespace Blog.Controllers
{
    public class ReleaseArticleController : Controller
    {
        // GET: ReleaseArticle
        public ActionResult Index()
        {
            if (Session["userInfo"] != null)
            {
                TempData["img"] = (Session["userInfo"] as users).img;
                TempData["name"] = (Session["userInfo"] as users).name;
                return View();
            }
            else
            {
                return Content("<script>location.href='/Home/Index'</script>");
            }
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult AddArticle(articles ar)
        {
            using (bokeEntities db = new bokeEntities())
            {
                ar.uid = (Session["userInfo"] as users).id;
                ar.created_at = DateTime.Now;
                ar.updated_at = DateTime.Now;
                ar.lable = Request["lables"];
                ar.text = Request["text"];
                ar.content = Request["content"];
                ar.state = 0;
                db.articles.Add(ar);
                if (db.SaveChanges() > 0)
                {
                    return Content("<script>alert('发表成功，请等待审核');location.href='/Home/Index'</script>");
                }
                else
                {
                    return Content("<script>alert('发表失败');</script>");
                }
            }
        }
    }
}