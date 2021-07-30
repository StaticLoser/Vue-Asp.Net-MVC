using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Blog.Models;
using Blog.Controllers;
using Boke.Controllers;

namespace Blog.Controllers
{
    public class SpaceController : Controller
    {
        public static bokeEntities db = new bokeEntities();

        // GET: Space
        public ActionResult Index(int id = 0)
        {
            if (Session["userInfo"] == null)
            {
                return Content("<script>location.href='/Home/Index';</script>");
            }
            else
            {
                int uid = (Session["userInfo"] as users).id;
                var data = db.users.FirstOrDefault(u => u.id == uid);
                ViewBag.userInfo = data;
                //获取用户发表的文章
                ViewBag.userArticle = db.articles.Include("users").Where(a => a.uid == uid).OrderBy(a => a.aid).Skip(5 * id).Take(5).ToList();
                var uTypes = db.articles.Include("users").Where(a => a.uid == uid).ToList();
                int ACount = db.articles.Where(a => a.uid == uid).Count();
                //分页总数
                int PageCount = (ACount + 5 - 1) / 5;
                ViewBag.PageCount = PageCount;
                string lables = null;
                string[] las = null;
                List<string> typesArr = null;
                //处理标签
                foreach (var item in uTypes as List<Blog.Models.articles>)
                {
                    lables += item.lable.ToLower();
                    las = lables.Split(',');
                }
                typesArr = las.Distinct().ToList();
                typesArr.RemoveAt(typesArr.Count - 1);
                ViewBag.UTypes = typesArr;
                return View();
            }
        }
        public ActionResult UserSet()
        {
            if (Session["userInfo"] == null)
            {
                return RedirectToAction("Index");
            }
            else
            {
                int id = (Session["userInfo"] as users).id;
                var data = db.users.Include("drafts").FirstOrDefault(u => u.id == id);
                ViewBag.userInfo = data;
                return View();
            }
        }

        public ActionResult UpInfo()
        {
            int id = (Session["userInfo"] as users).id;
            ViewBag.data = db.users.FirstOrDefault(u => u.id == id);
            return View();
        }
        [HttpPost]
        public ActionResult DoUpInfo(users u)
        {
            u.id = (Session["userInfo"] as users).id;
            var data = db.users.FirstOrDefault(d => d.id == u.id);
            data.name = u.name;
            data.email = u.email;
            data.sign = u.sign;
            int code = 0;
            string message = "修改失败";
            if (db.SaveChanges() > 0)
            {
                code = 200;
                message = "修改成功";
            }
            else
            {
                code = 100;
                message = "修改失败";
            }
            return Json(new { code = code, message = message });
        }
        public ActionResult UPFile(HttpPostedFileBase file)
        {
            if (file == null)
            {
                return Content("<script>alert('请选择文件!');location.href='/Space/UserSet'</script>");
            }
            //图片上传
            if (file.ContentLength != 0)
            {
                //保存文件
                file.SaveAs(Server.MapPath("~/Content/Image/users/" + file.FileName));
                int id = (Session["userInfo"] as users).id;
                var data = db.users.FirstOrDefault(u => u.id == id);
                data.img = "/Content/Image/users/" + file.FileName;
                if (db.SaveChanges() > 0)
                {
                    return Content("<script>alert('头像保存成功!');location.href='/Space/UserSet'</script>");
                }
                else
                {
                    return Content("<script>alert('头像保存失败!');location.href='/Space/UserSet'</script>");
                }
            }
            else
            {
                return Content("<script>alert('不能选择空文件!');location.href='/Space/UserSet'</script>");
            }
        }
        public ActionResult UPPwd()
        {
            return View();
        }
        public ActionResult DoUPPwd(string UsedPwd, string NewPwd, string ReNewPwd)
        {
            int id = (Session["userInfo"] as users).id;
            var data = db.users.FirstOrDefault(d => d.id == id);
            UsedPwd = Base.Md5Encoding(UsedPwd);
            NewPwd = Base.Md5Encoding(NewPwd);
            ReNewPwd = Base.Md5Encoding(ReNewPwd);
            //旧密码与当前密码不一致时
            if (UsedPwd != data.password)
            {
                return Content("<script>alert('旧密码与当前密码不一致!');location.href='/Space/UserSet'</script>");
            }
            //阻止修改时新旧密码一致
            if (data.password == NewPwd)
            {
                return Content("<script>alert('修改的密码不能与旧密码一致!');location.href='/Space/UserSet'</script>");
            }
            //阻止密码和确认密码不一致时
            if (NewPwd != ReNewPwd)
            {
                return Content("<script>alert('新密码和确认密码不一致!');location.href='/Space/UserSet'</script>");
            }
            data.password = NewPwd;
            if (db.SaveChanges() > 0)
            {
                return Content("<script>alert('修改成功!');location.href='/Login/Login'</script>");
            }
            else
            {
                return Content("<script>alert('修改失败!');location.href='/Space/UserSet'</script>");
            }
        }
        public ActionResult Article(int id = 0)
        {
            if (Session["userInfo"] == null)
            {
                return RedirectToAction("index");
            }
            int Uid = (Session["userInfo"] as users).id;
            var data = db.users.FirstOrDefault(u => u.id == Uid);
            ViewBag.userInfo = data;
            ViewBag.UArticles = db.articles.Include("Collect").Include("recommends").Where(a => a.uid == Uid).OrderByDescending(a => a.aid).Skip(10 * id).Take(10).ToList();
            ViewBag.ASum = db.articles.Where(a => a.uid == Uid).Count();
            int ACount = db.articles.Where(a => a.uid == Uid).Count();
            //分页总数
            int PageCount = (ACount + 10 - 1) / 10;
            ViewBag.PageCount = PageCount;
            return View();
        }
        public ActionResult DelAriticle(int id)
        {
            var data = db.articles.FirstOrDefault(a => a.aid == id);
            db.articles.Remove(data);
            if (db.SaveChanges() > 0)
            {
                return Content("<script>alert('删除成功!');location.href='/Space/Article'</script>");
            }
            else
            {
                return Content("<script>alert('删除失败!');location.href='/Space/Article'</script>");
            }

            //int code = 0;
            //string message = "删除失败";
            //int uid = (Session["userInfo"] as users).id;
            //if (db.SaveChanges() > 0)
            //{
            //    code = 200;
            //    message = "删除成功！";
            //    return Json(new { code = code, mesage = message });
            //}
            //else
            //{
            //    return Json(new { code = code, mesage = message });
            //}
        }
        //查文章
        public ActionResult GetUserArticle(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            return Json(db.articles.Where(a => a.uid == id).ToList(), JsonRequestBehavior.AllowGet);
        }
        public ActionResult UPAriticle(int id)
        {
            if (Session["userInfo"] != null)
            {
                TempData["img"] = (Session["userInfo"] as users).img;
                TempData["name"] = (Session["userInfo"] as users).name;
                ViewBag.Adata = db.articles.FirstOrDefault(a => a.aid == id);
                return View();
            }
            else
            {
                return Content("<script>location.href='/Home/Index'</script>");
            }
        }
        [ValidateInput(false)]
        public ActionResult DoUPAriticle(int id)
        {
            var data = db.articles.FirstOrDefault(a => a.aid == id);
            data.updated_at = DateTime.Now;
            data.lable = Request["lables"];
            data.text = Request["text"];
            data.content = Request["content"];
            data.title = Request["title"];
            data.state = 0;
            db.Configuration.ValidateOnSaveEnabled = false;
            if (db.SaveChanges() > 0)
            {
                return Content("<script>alert('发表成功，请等待审核');location.href='/Home/Index'</script>");
            }
            else
            {
                return Content("<script>alert('发表失败');</script>");
            }
        }

        //收藏
        public ActionResult Collects(int id = 0)
        {
            if (Session["userInfo"] == null)
            {
                return RedirectToAction("Index");
            }
            int Uid = (Session["userInfo"] as users).id;
            var data = db.users.FirstOrDefault(u => u.id == Uid);
            ViewBag.userInfo = data;
            ViewBag.Collects = db.Collect.Include("articles").Where(c => c.uid == Uid).OrderByDescending(c => c.createTime).Skip(10 * id).Take(10).ToList();
            ViewBag.CSum = db.Collect.Where(c => c.uid == Uid).Count();
            int ACount = ViewBag.CSum;
            //分页总数
            int PageCount = (ACount + 10 - 1) / 10;
            ViewBag.PageCount = PageCount;
            return View();
        }

        [HttpPost]
        public ActionResult DelCollect(int id)
        {
            int Uid = (Session["userInfo"] as users).id;
            var data = db.Collect.FirstOrDefault(c => c.aid == id && c.uid == Uid);
            db.Collect.Remove(data);
            int code = 0;
            string message = "修改失败";
            if (db.SaveChanges() > 0)
            {
                code = 200;
                message = "修改成功";
            }
            else
            {
                code = 100;
                message = "修改失败";
            }
            return Json(new { code = code, message = message });
        }
        public ActionResult Drafts(int id = 0)
        {
            if (Session["userInfo"] == null)
            {
                return RedirectToAction("Index");
            }
            int Uid = (Session["userInfo"] as users).id;
            var data = db.users.FirstOrDefault(u => u.id == Uid);
            ViewBag.userInfo = data;
            ViewBag.Drafts = db.drafts.Where(d => d.uid == Uid).OrderByDescending(d => d.create_at).Skip(10 * id).Take(10).ToList();
            ViewBag.CSum = db.drafts.Where(d => d.uid == Uid).Count();
            int ACount = ViewBag.CSum;
            //分页总数
            int PageCount = (ACount + 10 - 1) / 10;
            ViewBag.PageCount = PageCount;
            return View();
        }
        public ActionResult DoDrafts(int id)
        {
            if (Session["userInfo"] != null)
            {
                TempData["img"] = (Session["userInfo"] as users).img;
                TempData["name"] = (Session["userInfo"] as users).name;
                ViewBag.data = db.drafts.FirstOrDefault(d => d.did == id);
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
            using ( db = new bokeEntities())
            {
                ar.uid = (Session["userInfo"] as users).id;
                ar.created_at = DateTime.Now;
                ar.updated_at = DateTime.Now;
                ar.lable = Request["lables"];
                ar.text = Request["text"];
                ar.content = Request["content"];
                ar.state = 0;
                db.articles.Add(ar);
                int did = int.Parse(Request["did"]);
                var data = db.drafts.FirstOrDefault(d => d.did == did);
                db.drafts.Remove(data);
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