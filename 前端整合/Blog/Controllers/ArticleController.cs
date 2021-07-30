using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Blog.Models;
namespace BoKe.Controllers
{
    public class ArticleController : Controller
    {
        private bokeEntities db = new bokeEntities();

        // GET: Article
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 查询文章列表
        /// </summary>
        /// <param name="fc">控制器</param>
        /// <returns>json</returns>
        //POST :Article/GetList/
        public ActionResult GetList(FormCollection fc)
        {
            db.Configuration.ProxyCreationEnabled = false;

            var list = db.articles.OrderByDescending(p => p.created_at).ToList();
            var user = db.users.ToList();

            var result1 = list.Join(user, p => p.uid, c => c.id, (p, c) => new { name = c.name, aid = p.aid, title = p.title, content = p.content, is_del = p.is_del, lable = p.lable, state = p.state, created_at = string.Format("{0:U}", (p.created_at)) });

            var count = result1.Count();
            Dictionary<string, object> openWith = new Dictionary<string, object>();

            if (list == null)
            {
                openWith.Add("code", 400);
                openWith.Add("msg", "获取数据失败");
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
            else
            {
                openWith.Add("code", 200);
                openWith.Add("msg", "获取数据成功");
                openWith.Add("list", result1);
                openWith.Add("count", count / 10);
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }

        }

        /// <summary>
        /// 修改用户状态
        /// </summary>
        /// <param name="id">id</param>
        /// <param name="collection">控制器名</param>
        /// <param name="state">状态</param>
        /// <returns>bool</returns>
        // POST: Article/UpdateUserState/5
        [HttpPost]
        public bool UpdateUserState(int? uid, int state)
        {
            try
            {
                // TODO: Add update logic here

                users u = db.users.FirstOrDefault(p => p.id == uid);
                u.state = state;
                if (db.SaveChanges() > 0)
                {
                    return true;
                }
                else { return false; }

            }
            catch
            {
                return false;
            }
        }
       
        /// <summary>
        /// 文章待审
        /// </summary>
        /// <returns></returns>
        /// Article/GetDaiShenlList
        [HttpPost]
        public ActionResult GetDaiShenlList()
        {
            //查询待审核列表
            db.Configuration.ProxyCreationEnabled = false;

            var list = db.articles.Where(p => p.state == 1).OrderByDescending(p => p.created_at).ToList();
            var user = db.users.ToList();
            var result1 = list.Join(user, p => p.uid, c => c.id, (p, c) => new { name = c.name, aid = p.aid, title = p.title, content = p.content, is_del = p.is_del, lable = p.lable, state = p.state, created_at = string.Format("{0:U}", (p.created_at)) });

            var count = result1.Count();
            Dictionary<string, object> openWith = new Dictionary<string, object>();

            if (list == null)
            {
                openWith.Add("code", 400);
                openWith.Add("msg", "获取数据失败");
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
            else
            {
                openWith.Add("code", 200);
                openWith.Add("msg", "获取数据成功");
                openWith.Add("list", result1);
                openWith.Add("count", count / 10);
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// 查询通过文章列表
        /// </summary>
        /// <returns></returns>
        /// Article/GetArticlePassList
        [HttpPost]
        public ActionResult GetArticlePassList()
        {            
            db.Configuration.ProxyCreationEnabled = false;

            var list = db.articles.Where(p => p.state == 0).OrderByDescending(p => p.created_at).ToList();
            var user = db.users.ToList();
            var result1 = list.Join(user, p => p.uid, c => c.id, (p, c) => new { name = c.name, aid = p.aid, title = p.title, content = p.content, is_del = p.is_del, lable = p.lable, state = p.state, created_at = string.Format("{0:U}", (p.created_at)) });
            var count = result1.Count();
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            if (list == null)
            {
                openWith.Add("code", 400);
                openWith.Add("msg", "获取数据失败");
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
            else
            {
                openWith.Add("code", 200);
                openWith.Add("msg", "获取数据成功");
                openWith.Add("list", result1);
                openWith.Add("count", count / 10);
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// 查询未通过审核文章列表
        /// </summary>
        /// <returns>msg</returns>
        /// Article/GetArticlePassList
        [HttpPost]
        public ActionResult GetArticleFailedList()
        {
            db.Configuration.ProxyCreationEnabled = false;

            var list = db.articles.Where(p => p.state == 2).OrderByDescending(p => p.created_at).ToList();
            var user = db.users.ToList();
            var result1 = list.Join(user, p => p.uid, c => c.id, (p, c) => new { name = c.name, aid = p.aid, title = p.title, content = p.content, is_del = p.is_del, lable = p.lable, state = p.state, created_at = string.Format("{0:U}", (p.created_at)) });
            var count = result1.Count();
            Dictionary<string, object> openWith = new Dictionary<string, object>();

            if (list == null)
            {
                openWith.Add("code", 400);
                openWith.Add("msg", "获取数据失败");
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
            else
            {
                openWith.Add("code", 200);
                openWith.Add("msg", "获取数据成功");
                openWith.Add("list", result1);
                openWith.Add("count", count / 10);
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// 文章模糊查询
        /// </summary>
        /// <param name="title">标题</param>
        /// <param name="fc">控制器</param>
        /// <returns>文章列表</returns>
        //POST: Article/GetArticleLike/
        public ActionResult GetArticleLike(string title, FormCollection fc)
        {
            db.Configuration.ProxyCreationEnabled = false;
            //article
            var list = db.articles.Where(p => p.title.Contains(title)).OrderByDescending(p => p.created_at).ToList();
            //user
            var user = db.users.ToList();
            var result1 = list.Join(user, p => p.uid, c => c.id, (p, c) => new { name = c.name, aid = p.aid, title = p.title, content = p.content, is_del = p.is_del, lable = p.lable, state = p.state, created_at = string.Format("{0:U}", (p.created_at)) });


            Dictionary<string, object> openWith = new Dictionary<string, object>();

            if (list == null)
            {
                openWith.Add("code", 400);
                openWith.Add("msg", "获取数据失败");
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
            else
            {
                openWith.Add("code", 200);
                openWith.Add("msg", "获取数据成功");
                openWith.Add("list", result1);
                return Json(openWith, JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// 得到文章详情
        /// </summary>
        /// <param name="aid">文章id</param>
        /// <param name="collection">控制器名</param>
        /// <returns>msg</returns>
        [HttpPost]
        public ActionResult GetArticleDetail(int? aid, FormCollection collection)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var article = db.articles.FirstOrDefault(p => p.aid == aid);
            Dictionary<string, object> dic = new Dictionary<string, object>();
            if (article != null)
            {
                dic.Add("msg", "成功");
                dic.Add("code", "200");
                dic.Add("article", article);
            }
            else
            {
                dic.Add("code", "500");
                dic.Add("msg", "失败");
            }
            return Json(dic);
        }

        /// <summary>
        /// 修改文章
        /// </summary>
        /// <param name="aid">文章id</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult UpdateArticleState(int? aid, int state)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var article = db.articles.FirstOrDefault(p => p.aid == aid);
            Dictionary<string, object> dic = new Dictionary<string, object>();
            article.state = state;
            if (db.SaveChanges() > 0)
            {
                dic.Add("msg", "成功");
                dic.Add("code", "200");
                dic.Add("article", article);
            }
            else
            {
                dic.Add("code", "500");
                dic.Add("msg", "失败");
            }
            return Json(dic);
        }

        /// <summary>
        /// 删除举报表
        /// </summary>
        /// <param name="id">举报id</param>
        /// <returns>msg</returns>
        // POST: Article/DelInfo/5
        [HttpPost]
        public ActionResult DelInfo(int id)
        {
            db.Configuration.ProxyCreationEnabled = false;
            //var info = db.informs.FirstOrDefault(p => p.id==id);

            string str = $"delete from informs where aid={id}";
            Dictionary<string, object> dic = new Dictionary<string, object>();
            if (db.Database.ExecuteSqlCommand(str) > 0)
            {
                dic.Add("msg", "封禁成功");
                dic.Add("code", 200);
            }
            else
            {
                dic.Add("msg", "封禁失败");
                dic.Add("code", 500);
            }
            return Json(dic);
        }

        /// <summary>
        /// 统计管理员
        /// </summary>
        /// <returns>json</returns>
        // POST: Article/AdminEchars
        [HttpPost]
        public ActionResult AdminEchars()
        {
            //管理员总数
            var r1 = db.admins.Count();
            //管理员类型 超级管理员
            var r2 = db.admins.Where(p => p.Type == 0).Count();
            //管理员类型 普通管理员
            var r3 = db.admins.Where(p => p.Type == 1).Count();
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            var res = new List<object>()
            {
                new {value=r2,name = "超级管理员" },
                new {value=r3,name = "普通管理员" },
            };
            openWith.Add("list", res);
            openWith.Add("Count", r1);
            return Json(openWith);
        }

        /// <summary>
        /// 创建文章
        /// </summary>
        /// <param name="a">文章实例</param>
        /// <param name="collection">控制名</param>
        /// <returns>bool</returns>
        // POST: Article/Create
        [HttpPost]
        public bool Create(articles a, FormCollection collection)
        {
            try
            {
                db.articles.Add(a);
                if (db.SaveChanges() > 0) return true;
                else return false;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 编辑文章
        /// </summary>
        /// <param name="id">文章id</param>
        /// <param name="a">文章实例</param>
        /// <param name="collection">控制器名</param>
        /// <returns>msg</returns>
        // POST: Article/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, articles a, FormCollection collection)
        {
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            try
            {
                // TODO: Add update logic here
                var article = db.articles.FirstOrDefault(p => p.aid == id);
                article.content = a.content;
                article.lable = a.lable;
                article.title = a.title;
                if (db.SaveChanges() > 0)
                {
                    openWith.Add("code", 200);
                    openWith.Add("msg", "修改成功");
                    return Json(openWith, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    openWith.Add("code", 400);
                    openWith.Add("msg", "未传入指定参数");
                    return Json(openWith, JsonRequestBehavior.AllowGet);
                }
            }
            catch
            {
                openWith.Add("msg", "出错了");
                return Json(openWith);
            }
        }

        /// <summary>
        /// 编辑用户信息
        /// </summary>
        /// <param name="id">用户id</param>
        /// <param name="user">用户实例</param>
        /// <returns></returns>
        // POST: Article/EditUserDetail
        [HttpPost]
        public bool EditUserDetail(int id, users user)
        {
            try
            {
                // TODO: Add update logic here

                users u = db.users.FirstOrDefault(p => p.id == id);
                u.id = id;
                u.name = user.name;
                u.email = user.email;
                u.sign = user.sign;
                if (db.SaveChanges() > 0) return true;
                else return false;
            }
            catch
            {
                return false;
            }
        }


        /// <summary>
        /// 
        /// </summary>删除文章
        /// <param name="id">文章id</param>
        /// <param name="collection">控制器名</param>
        /// <returns></returns>
        // POST: Article/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            Dictionary<string, object> dlist = new Dictionary<string, object>();
            try
            {
                // TODO: Add delete logic here
                articles a = db.articles.FirstOrDefault(p => p.aid == id);


                db.articles.Remove(a);
                if (db.SaveChanges() > 0)
                {
                    dlist.Add("code", 200);
                    dlist.Add("msg", "删除成功！");
                    return Json(dlist, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    dlist.Add("code", 400);
                    dlist.Add("msg", "无法删除内部出错！");
                    return Json(dlist, JsonRequestBehavior.AllowGet);
                }
            }
            finally
            {

            }
        }

        /// <summary>
        /// 查询全部用户
        /// </summary>
        /// <param name="fc">控制器名</param>
        /// <returns>json</returns>
        //POST : users/List
        [HttpPost]
        public ActionResult List(FormCollection fc)
        {
            db.Configuration.ProxyCreationEnabled = false;
            var list = db.users.OrderByDescending(p => p.created_at).ToList();
            var res = list.Join(list, p => p.id, d => d.id, (p, d) => new { id = p.id, name = p.name, email = p.email, create_at = string.Format("{0:U}", (p.created_at)), state = p.state, sign = p.sign });
            return Json(res);
        }

        /// <summary>
        /// 删除用户
        /// </summary>
        /// <param name="id">用户id</param>
        /// <returns>bool</returns>
        [HttpPost]
        //  Article/DeleteUser/id
        public bool DeleteUser(int id)
        {
            try
            {
                users u = db.users.FirstOrDefault(p => p.id == id);
                db.users.Remove(u);
                if (db.SaveChanges() > 0) return true;
                else return false;

            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 注册管理员
        /// </summary>
        /// <param name="name">管理员登录名</param>
        /// <param name="Password">密码</param>
        /// <returns></returns>
        //POST:  Article/AddAdmin
        [HttpPost]
        public ActionResult AddAdmin(string name, string Password)
        {
            Dictionary<string, object> dic = new Dictionary<string, object>();
            admins a = new admins()
            {
                name = name,
                Password = Password,
                Type = 1,
                Created_at = DateTime.Now
            };
            db.admins.Add(a);
            if (db.SaveChanges() > 0)
            {
                dic.Add("msg", "添加成功");
                dic.Add("code", 200);
            }
            else
            {
                dic.Add("msg", "添加失败");
                dic.Add("code", 500);
            }
            return Json(dic);
        }

        //  POST:Article/AdminList       
        /// <summary>
        /// 获取管理员列表
        /// </summary>
        /// <returns>json管理员列表</returns>
        /// //Article/AdminList
        [HttpPost]
        public ActionResult AdminList()
        {
            var admin = db.admins.OrderByDescending(p=>p.Created_at).ToList();
            var res = admin.Join(admin, p => p.id, d => d.id, (p, d) => new { name = p.name, types = p.Type == 0 ? "超级管理员" : "普通管理员", typeid = p.Type, create_at = string.Format("{0:U}", (p.Created_at)),Password=p.Password,id=p.id });
            return Json(res);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="adminName">管理员登录名</param>
        /// <param name="pass">密码</param>
        /// <returns>json对象</returns>
        //POST:  Article/AdminLogin
        [HttpPost]
        public ActionResult AdminLogin(string adminName, string pass)
        {

            var admin = db.admins.FirstOrDefault(p => p.name == adminName && p.Password == pass);
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            if (admin != null)
            {
                openWith.Add("msg", "登录成功");
                openWith.Add("code", 200);
                openWith.Add("info", admin);
            }
            else
            {
                openWith.Add("msg", "登录失败");
                openWith.Add("code", 500);
            }
            return Json(openWith);
        }

        /// <summary>
        /// 返回  文章 ECharts图表 数据
        /// </summary>
        /// <returns>json对象</returns>
        // POST: Article/GetArticleStaticle
        [HttpPost]
        public ActionResult GetArticleStaticle()
        {
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            //通过
            var res1 = db.articles.Where(p => p.state == 0).Count();
            //待审核
            var res2 = db.articles.Where(p => p.state == 1).Count();
            //封禁
            var res4 = db.articles.Where(p => p.state == 2).Count();
            //总数
            var res5 = db.articles.Count();
            var list = new List<object>()
            {
                new { value = res1, name = "已通过" },
                new { value = res2, name = "待审核" },
                new { value = res4, name = "封禁" },
            };


            openWith.Add("list", list);
            openWith.Add("Count", res5);
            return Json(openWith);
        }

        /// <summary>
        /// 得到用户的各种状态和总数
        /// </summary>
        /// <returns>json对象</returns>
        //POST: Article/GetUserStaticle
        [HttpPost]
        public ActionResult GetUserStaticle()
        {
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            //封禁用户
            var list1 = db.users.Where(p => p.state == 0).Count();
            //正常用户
            var list2 = db.users.Where(p => p.state == 1).Count();
            //全部用户
            var list3 = db.users.Count();
            var res = new List<object>()
            {
                new {value=list2,name="封禁用户" },
                new {value=list1,name="正常用户" },
            };
            openWith.Add("list", res);
            openWith.Add("Count", list3);
            return Json(openWith);
        }

        /// <summary>
        /// 获取举报信息
        /// </summary>
        /// <returns>json对象</returns>
        //  Article/InfoList
        [HttpPost]
        public ActionResult InfoList()
        {
            var res = (from c in db.informs
                       join v in db.users on c.uid equals v.id
                       join r in db.articles on c.aid equals r.aid
                       select new
                       {
                           //文章id
                           aid = r.aid,
                           //举报编号
                           id = c.id,
                           //举报人
                           username = v.name,
                           //作者
                           username2 = r.users.name,
                           //文章内容
                           article = r.content,
                           //标题
                           articletitle = r.title,
                           //举报内容
                           infoContent = c.content,
                           //状态
                           state = r.state
                       }).ToList();
            Dictionary<string, object> openWith = new Dictionary<string, object>();
            if (res != null)
            {
                openWith.Add("msg", "成功");
                openWith.Add("code", 200);
                openWith.Add("res", res);
            }
            else
            {
                openWith.Add("msg", "失败");
                openWith.Add("code", 500);
            }
            return Json(openWith);
        }
        
        /// <summary>
        /// 删除管理员
        /// </summary>
        /// <param name="id">管理员id</param>
        /// <returns>msg</returns>
        [HttpPost]
        public ActionResult DelAdmin(int id)
        {
            Dictionary<string, object> dic = new Dictionary<string, object>();
            var admin= db.admins.FirstOrDefault(p=>p.id==id);
            db.admins.Remove(admin);
            if (db.SaveChanges()>0)
            {
                dic.Add("msg", "删除成功");
                dic.Add("code", 200);
            }
            else
            {
                dic.Add("msg", "删除失败");
                dic.Add("code", 500);
            }

            return Json(dic);
        }

        /// <summary>
        /// 管理员修改
        /// </summary>
        /// <param name="id">管理员id</param>
        /// <param name="adminName">管理员名</param>
        /// <param name="pass">密码</param>
        /// <returns></returns>
        /// //  Article/UpdateAdmin
        [HttpPost]
        public ActionResult UpdateAdmin(int id,string adminName,string pass)
        {
            Dictionary<string, object> dic = new Dictionary<string, object>();
            var admin = db.admins.FirstOrDefault(p => p.id == id);
            admin.name = adminName;
            admin.Password = pass;
            if (db.SaveChanges() > 0)
            {
                dic.Add("msg", "修改成功");
                dic.Add("code", 200);
            }
            else
            {
                dic.Add("msg", "修改失败");
                dic.Add("code", 500);
            }

            return Json(dic);
        }

    }
}
