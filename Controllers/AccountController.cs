using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;

using CreditCache.Data;
using CreditCache.Models;

namespace CreditCache.Controllers
{
  [Authorize(Roles = "Admin,Employee")]
  [ApiController]
  [Route("{controller=Home}/{action=Index}/{id?}")] //This is cheating. Should really be routing each method individually
  public class AccountController : Controller
  {

    private readonly ApplicationDbContext context;
    public AccountController(ApplicationDbContext c) {
      context = c;
    }

    [HttpGet]
    public string Index()
    {
      return "This is the default path. Are you sure you meant to call this?";
    }

    [HttpGet]
    public IEnumerable<Account> GetAccounts(bool isIncludeRelatedData = true)
    {
      return Account.GetAllAccounts(isIncludeRelatedData, context);
    }

    [HttpGet]
    public Account GetAccount(int acctId)
    {
      return Account.GetSingleAccount(acctId, context);
    }

    [HttpGet]
    public decimal GetCashoutValue(int acctId)
    {
      return Account.GetCashoutValue(acctId, context);
    }

    [HttpPost]
    public Account AddAccount(string pFirstName, string pLastName)
    {
      return Account.CreateAccount(pFirstName, pLastName, context);
    }

    [HttpPost]
    public Account AddAccountByAccount(Account a)
    {
      return Account.CreateAccount(a, context);
    }

    [HttpDelete]
    public IActionResult DeleteAccountByAccount(Account a) {
      return DeleteAccountById(a.Id);
    }

    [HttpDelete]
    public IActionResult DeleteAccountById(int pId) {
      try {
        Account.DeleteSingleAccount(pId, context);
      } catch (InvalidOperationException) {
        return NotFound();
      }

      return Ok();
    }
  }
}
