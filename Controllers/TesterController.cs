using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Text.Encodings.Web;

using thing.Data;
using thing.Models;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace thing.Controllers
{
  [ApiController]
  [Route("{controller=Home}/{action=Index}/{id?}")] //This is cheating. Should really be routing each method individually
  public class TesterController : ControllerBase
  {
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

    [HttpGet]
    public IEnumerable<Account> GetAccounts()
    {
      using var context = new ApplicationDbContext();
      return context.Accounts.ToArray();
    }

    [HttpPost]
    public Account AddAccount(string pFirstName, string pLastName)
    {
      Account a = new Account(pFirstName, pLastName);
      using (var context = new ApplicationDbContext())
      {
        context.Accounts.Add(a);
        context.SaveChanges();
      }
      return a;
    }

    [HttpPost]
    public Account AddAccountByAccount(Account a)
    {
      using (var context = new ApplicationDbContext())
      {
        context.Accounts.Add(a);
        context.SaveChanges();
      }
      return a;
    }

    [HttpDelete]
    public IActionResult DeleteAccountByAccount(Account a) {
      using var context = new ApplicationDbContext();

      try { 
        context.Accounts.Remove(a);
        context.SaveChanges();
      } catch (DbUpdateConcurrencyException) {
        return NotFound();
      }

      return Ok();
    }

    [HttpDelete]
    public IActionResult DeleteAccountById(int pId) {
      using var context = new ApplicationDbContext();

      Account acct = context.Accounts.Where(a => a.Id == pId).FirstOrDefault();
      if(acct == null) { return NotFound(); }
      context.Accounts.Remove(acct);
      context.SaveChanges();

      return Ok();
    }
  }
}
