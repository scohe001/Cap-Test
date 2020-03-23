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

    // // To convert credits over. This is a pretty hacky job. Going to need to do it better when it's for real
    // [HttpPost]
    // public IActionResult Convert() {
    //   using StreamReader streamReader = System.IO.File.OpenText("/Users/aricohen/Desktop/dev/Credit Cache/Credits.json");
    //   //var thing = (Dictionary<string, object>)JsonSerializer.Create().Deserialize(streamReader.ReadToEnd());
    //   string txt = streamReader.ReadToEnd();
    //   dynamic thing = JsonConvert.DeserializeObject(txt);
    //   Console.WriteLine(thing[0]);

    //   foreach(dynamic cust in thing) {
    //     Account acct = new Account();
    //     acct.FirstName = cust.firstName;
    //     acct.LastName = cust.lastName;
    //     acct.PhoneNumber = cust.phoneNumber;
    //     acct.Notes = cust.notes;

    //     acct = context.Accounts.Add(acct).Entity;
    //     context.SaveChanges();

    //     foreach(dynamic action in cust.Actions) {
    //       Transaction tran = new Transaction();
    //       tran.Account = acct;
    //       tran.AccountId = acct.Id;
    //       tran.Amount = action.theValue;
    //       tran.Date = action.date;

    //       string actionType = action.transaction;

    //       TransactionType tranType = context.TransactionTypes.FirstOrDefault(tt => tt.Name == actionType);
    //       tran.TransactionType = tranType;
    //       tran.TransactionTypeId = tranType.Id;

    //       context.Add(tran);
    //     }

    //     context.SaveChanges();
    //   }


    //   return Ok();
    // }
  }
}
