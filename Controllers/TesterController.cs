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
      return context.Accounts
                    .Include(acct => acct.Transactions)
                        .ThenInclude(tran => tran.TransactionType)
                    .ToArray();
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

    [HttpGet]
    public IEnumerable<Transaction> GetTransactions()
    {
      using var context = new ApplicationDbContext();
      return context.Transactions
                    .Include(tran => tran.Account)
                    .Include(tran => tran.TransactionType)
                    .ToArray();
    }

    [HttpGet]
    public IEnumerable<Transaction> GetTransactionsForAccountId(int acctId)
    {
      using var context = new ApplicationDbContext();
      return context.Transactions
                    .Include(tran => tran.TransactionType)
                    .Where(tran => tran.AccountId == acctId)
                    .ToArray();
    }

    [HttpGet]
    public IEnumerable<TransactionType> GetTransactionTypes()
    {
      using var context = new ApplicationDbContext();
      return context.TransactionTypes
                    .ToArray();
    }

    [HttpPost]
    public Transaction AddTransaction(Transaction pTran)
    {
        Transaction tran = new Transaction();
        tran.AccountId = pTran.AccountId;
        tran.TransactionTypeId = pTran.TransactionTypeId;
        tran.Amount = pTran.Amount;
        tran.Date = DateTime.Now;

        using var context = new ApplicationDbContext();
        var entry = context.Transactions.Add(tran);
        context.SaveChanges();
        return entry.Entity;
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

    // // To convert credits over. This is a pretty hacky job. Going to need to do it better when it's for real
    // [HttpPost]
    // public IActionResult Convert() {
    //   using StreamReader streamReader = System.IO.File.OpenText("/Users/aricohen/Desktop/dev/Credit Cache/Credits.json");
    //   //var thing = (Dictionary<string, object>)JsonSerializer.Create().Deserialize(streamReader.ReadToEnd());
    //   string txt = streamReader.ReadToEnd();
    //   dynamic thing = JsonConvert.DeserializeObject(txt);
    //   Console.WriteLine(thing[0]);

    //   using var context = new ApplicationDbContext();
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
