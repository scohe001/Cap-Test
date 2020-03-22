using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using thing.Data;
using thing.Models;
using System.Globalization;

namespace thing.Controllers
{
  [ApiController]
  [Route("{controller=Home}/{action=Index}/{id?}")] //This is cheating. Should really be routing each method individually
  public class AccountController : Controller
  {
    [HttpGet]
    public string Index()
    {
      return "This is the default path. Are you sure you meant to call this?";
    }

    [HttpGet]
    public IEnumerable<Account> GetAccounts(bool isIncludeRelatedData = true)
    {
      using var context = new ApplicationDbContext();
      return Account.GetAllAccounts(isIncludeRelatedData, context);
    }

    [HttpGet]
    public Account GetAccount(int acctId)
    {
      using var context = new ApplicationDbContext();
      return Account.GetSingleAccount(acctId, context);
    }

    [HttpPost]
    public Account AddAccount(string pFirstName, string pLastName)
    {
      using var context = new ApplicationDbContext();
      return Account.CreateAccount(pFirstName, pLastName, context);
    }

    [HttpPost]
    public Account AddAccountByAccount(Account a)
    {
      using var context = new ApplicationDbContext();
      return Account.CreateAccount(a, context);
    }

    [HttpDelete]
    public IActionResult DeleteAccountByAccount(Account a) {
      return DeleteAccountById(a.Id);
    }

    [HttpDelete]
    public IActionResult DeleteAccountById(int pId) {
      using var context = new ApplicationDbContext();

      try {
        Account.DeleteSingleAccount(pId, context);
      } catch (InvalidOperationException) {
        return NotFound();
      }

      return Ok();
    }
  }
}
