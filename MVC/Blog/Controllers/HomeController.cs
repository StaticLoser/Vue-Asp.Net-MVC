using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Blog.Models;

namespace Blog.Controllers
{
    public class HomeController : Controller
    {
        private bokeEntities db = new bokeEntities();
        public ActionResult Index(int id = 0)
        {

            if (Session["userInfo"] != null)
            {
                ViewBag.img = (Session["userInfo"] as users).img;
                ViewBag.name = (Session["userInfo"] as users).name;
            }
            //读取新闻列表
            using (bokeEntities db = new bokeEntities())
            {
                ViewBag.Articles = db.articles.Include("recommends").Include("comments").Include("users").OrderByDescending(a => a.created_at).Skip(10 * id).Take(6).ToList();
                ViewBag.userTop = db.users.Include("articles").OrderByDescending(u => u.articles.Count()).Take(10).ToList();
                int ACount = db.articles.Count();
                //分页总数
                int PageCount = (ACount + 10 - 1) / 10;
                ViewBag.PageCount = PageCount;
                return View();
            }
        }
        public ActionResult TodayHot(int id = 0)
        {
            if (Session["userInfo"] != null)
            {
                ViewBag.img = (Session["userInfo"] as users).img;
                ViewBag.name = (Session["userInfo"] as users).name;
            }
            //读取新闻列表
            using (bokeEntities db = new bokeEntities())
            {
                DateTime date = DateTime.UtcNow.Date;
                ViewBag.Articles = db.articles.Include("users").Include("recommends").Include("comments").Where(a => a.created_at >= date).OrderByDescending(a => a.recommends.Count).Skip(10 * id).Take(6).ToList();
                ViewBag.userTop = db.users.Include("articles").OrderByDescending(u => u.articles.Count()).Take(10).ToList();
                int ACount = db.articles.Include("users").Where(a => a.created_at >= date).Count();
                //分页总数
                int PageCount = (ACount + 10 - 1) / 10;
                ViewBag.PageCount = PageCount;
                return View();
            }
        }
        public ActionResult WeekHot(int id = 0)
        {
            if (Session["userInfo"] != null)
            {
                ViewBag.img = (Session["userInfo"] as users).img;
                ViewBag.name = (Session["userInfo"] as users).name;
            }
            //读取新闻列表
            using (bokeEntities db = new bokeEntities())
            {
                DateTime date = DateTime.UtcNow.Date.AddDays(-7);
                ViewBag.Articles = db.articles.Include("users").Include("recommends").Include("comments").Where(a => a.created_at >= date).OrderByDescending(a => a.recommends.Count).Skip(10 * id).Take(6).ToList();
                ViewBag.userTop = db.users.Include("articles").OrderByDescending(u => u.articles.Count()).Take(10).ToList();
                int ACount = db.articles.Include("users").Where(a => a.created_at >= date).Count();
                //分页总数
                int PageCount = (ACount + 10 - 1) / 10;
                ViewBag.PageCount = PageCount;
                return View();
            }
        }
        public ActionResult NewArticle(int id = 0)
        {
            if (Session["userInfo"] != null)
            {
                ViewBag.img = (Session["userInfo"] as users).img;
                ViewBag.name = (Session["userInfo"] as users).name;
            }
            //读取新闻列表
            using (bokeEntities db = new bokeEntities())
            {
                DateTime date = DateTime.UtcNow.Date;
                ViewBag.Articles = db.articles.Include("users").Include("recommends").Include("comments").Where(a => a.created_at >= date).OrderByDescending(a => a.created_at).Skip(10 * id).Take(6).ToList();
                ViewBag.userTop = db.users.Include("articles").OrderByDescending(u => u.articles.Count()).Take(10).ToList();
                int ACount = db.articles.Include("users").Where(a => a.created_at >= date).Count();
                //分页总数
                int PageCount = (ACount + 10 - 1) / 10;
                ViewBag.PageCount = PageCount;
                return View();
            }
        }
        public ActionResult LogOut()
        {
            Session.Remove("userInfo");
            return RedirectToAction("Index");
        }
        public ActionResult Detail(int? id)
        {
            //查询微博详情
            if (Session["userInfo"] != null)
            {
                ViewBag.img = (Session["userInfo"] as users).img;
                ViewBag.name = (Session["userInfo"] as users).name;
            }
            //var list = db.articles.Include("users").FirstOrDefault(p => p.aid == id);
            //ViewBag.Title = list.title;
            //ViewBag.Label = list.lable;
            //ViewBag.Content = list.content;
            //ViewBag.Createtime = list.created_at;
            articles article = db.articles.Find(id);
            ViewBag.User = article.users.name;
            ViewBag.CommentList = db.comments.Where(a => a.aid == id).OrderByDescending(p => p.created_at).ToList();
            ViewBag.ReComment = db.recommends.OrderByDescending(p => p.create_at).ToList();
            ViewBag.colloctCount = db.Collect.Where(p => p.aid == id).Count();
            ViewBag.LikeCount = db.Like.Where(p => p.aid == id).Count();
            return View(article);
        }
        [HttpPost]
        public ActionResult pinglun(string content,int aid)
        {
            int id = (Session["userInfo"] as users).id;
            if (Session["userInfo"] != null)
            {
                comments comment = new comments()
                {
                    content = content,
                    aid = aid,
                    uid = id,
                    praies = 1,
                    created_at = DateTime.Now

                };
                db.comments.Add(comment);
                db.SaveChanges();
                return Content("<script>alert('评论成功');self.location=document.referrer;</script>");
            }
            else
            {
                return Content("<script>alert('请登录后在评论！');self.location=document.referrer;</script>");
            }

        }
        //收藏
        public ActionResult Collocts(int aid)
        {

            if (Session["userInfo"] == null)
            {
                return Content("<script>alert('请先登录再操作');self.location=document.referrer;</script>");
            }
            int uid = (Session["userInfo"] as users).id;
            Collect c = db.Collect.FirstOrDefault(a => a.aid == aid && a.uid == uid);
            if (c != null)
            {
                db.Collect.Remove(c);
                db.SaveChanges();
                return Content("<script>alert('取消收藏');self.location=document.referrer;</script>");
            }
            else
            {
                Collect col = new Collect() { aid = aid, uid = uid, createTime = DateTime.Now };
                db.Collect.Add(col);
                db.SaveChanges();
                return Content("<script>alert('收藏成功');self.location=document.referrer;</script>");
            }
        }

        //点赞
        public ActionResult Like(int aid)
        {

            if (Session["userInfo"] == null)
            {
                return Content("<script>alert('请先登录再操作');self.location=document.referrer;</script>");
            }
            int uid = (Session["userInfo"] as users).id;
            Like like = db.Like.FirstOrDefault(a => a.aid == aid && a.uid == uid);
            if (like != null)
            {
                db.Like.Remove(like);
                db.SaveChanges();
                return Content("<script>alert('取消点赞');self.location=document.referrer;</script>");
            }
            else
            {
                Like likes = new Like() { aid = aid, uid = uid, created_at = DateTime.Now };
                db.Like.Add(likes);
                db.SaveChanges();
                return Content("<script>alert('点赞成功');self.location=document.referrer;</script>");
            }
        }

        //举报页
        public ActionResult Informs(int? id)
        {
            articles article = db.articles.Find(id);
            return View(article);
        }
        //举报
        [HttpPost]
        public ActionResult DoInform(int aid)
        {
            int id = (Session["userInfo"] as users).id;
            if (Session["userInfo"] != null)
            {
                informs inform = new informs()
                {
                    aid = aid,
                    uid = id,
                    type = Request["types"],
                    content = Request["content"],
                    create_at = DateTime.Now
                };
                db.informs.Add(inform);
                db.SaveChanges();
                return View("Success");
            }
            else
            {
                return Content("<script>alert('请先登录再操作');self.location=document.referrer;</script>");
            }
        }
        public ActionResult Success()
        {
            return View();
        }
    }
}