using System;
using System.IO;
using System.Linq;
using System.Text.Encodings.Web;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

using Newtonsoft.Json;

using thing.Data;
using thing.Models;
using System.Globalization;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace thing.Controllers
{
  [ApiController]
  [Route("{controller=Home}/{action=Index}/{id?}")] //This is cheating. Should really be routing each method individually
  public class TesterController : ControllerBase
  {

    private readonly ApplicationDbContext context;
    public TesterController(ApplicationDbContext c) {
      context = c;
    }

    // GET: /Tester/
    [HttpGet]
    public string Index()
    {
      return "An index. Basically the default";
    }

    // GET: /Tester/Welcome
    [HttpGet]
    public string Welcome()
    {
      return "Here's a welcome action";
    }

    // GET: /Tester/Params
    [HttpGet]
    public string Params(string str, int x)
    {
      return HtmlEncoder.Default.Encode($"str: {str}, x: {x}");
    }

  }
}
