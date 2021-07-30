using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Blog.Models;
using Boke.Controllers;

namespace Blog.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        public ActionResult Register()
        {
            return View();
        }
        [HttpPost]
        public ActionResult DoLogin()
        {
            string LoginID = Request["LoginID"];
            string password = Request["password"];
            if (string.IsNullOrEmpty(LoginID))
            {
                return Content("<script>alert('用户名不能为空！');location.href='/Login/Login'</script>");
            }
            if (string.IsNullOrEmpty(password))
            {
                return Content("<script>alert('密码不能为空！');location.href='/Login/Login'</script>");
            }
            using (bokeEntities db = new bokeEntities())
            {
                password = Base.Md5Encoding(password);
                users user = db.users.FirstOrDefault(p => p.LoginID == LoginID && p.password == password);
                if (user == null)
                {
                    return Content("<script>alert('账号或密码错误！');location.href='/Login/Login'</script>");
                }
                Session["userInfo"] = user;
                Session["id"] = db.users.FirstOrDefault(p => p.LoginID == LoginID && p.password == password).id;
            }
            return Content("<script>location.href='/Home/Index'</script>");
        }
        //注册
        [HttpPost]
        public ActionResult DoReg()
        {
            string LoginID = Request["LoginID"];
            string password = Request["password"];
            if (string.IsNullOrEmpty(LoginID))
            {
                return Content("<script>alert('用户名不能为空！');location.href='/Login/Login'</script>");
            }
            if (string.IsNullOrEmpty(password))
            {
                return Content("<script>alert('密码不能为空！');location.href='/Login/Login'</script>");
            }
            using (bokeEntities db = new bokeEntities())
            {
                //判断账号是否存在
                users user = db.users.FirstOrDefault(p => p.LoginID == LoginID);
                if (user != null)
                {
                    return Content("<script>alert('账号已存在！');location.href='/Login/Register'</script>");
                }
                //账号不存在执行添加用户
                password = Base.Md5Encoding(password);
                users users = new users()
                {
                    name = "博客用户" + new Random().Next(99999),
                    LoginID = LoginID,
                    password = password,
                    img = "/Content/Image/users/1.png",
                    sign = "这个用户很懒，什么都没有写。",
                    cover = "/Content/Image/covers/1.jpg",
                    created_at = DateTime.Now,
                    state = 0
                };
                db.users.Add(users);
                db.SaveChanges();
            }
            return Content("<script>alert('注册成功！');location.href='/Login/Login'</script>");
        }
    }
}