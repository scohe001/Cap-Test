using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Diagnostics;

using thing.Data;
using thing.Models;
using System.Globalization;

namespace thing.Controllers
{
  [ApiController]
  [Route("{controller=Home}/{action=Index}/{id?}")] //This is cheating. Should really be routing each method individually
  public class CommonController : Controller
  {
    private readonly ApplicationDbContext context;
    public CommonController(ApplicationDbContext c) {
      context = c;
    }

    [HttpGet]
    public Dictionary<string, string> GetVersionString() {
      Assembly assembly = Assembly.GetExecutingAssembly();
      FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
      Dictionary<string, string> versionDict = new Dictionary<string, string>();
      versionDict["Version"] = fileVersionInfo.ProductVersion;
      return versionDict;
    }
  }
}
