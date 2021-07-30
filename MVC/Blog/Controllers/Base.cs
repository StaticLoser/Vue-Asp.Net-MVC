using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace Boke.Controllers
{
    public class Base
    {
        ///MD5加密
        public static string Md5Encoding(string passText)
        {
            MD5 md5 = new MD5CryptoServiceProvider();
            byte[] fromData = System.Text.Encoding.UTF8.GetBytes(passText);
            byte[] targetData = md5.ComputeHash(fromData);
            //加密后的字符串
            string byteStr = "";
            for (int i = 0; i < targetData.Length; i++)
            {
                byteStr += targetData[i].ToString("x2");
            }
            return byteStr;
        }
    }
}