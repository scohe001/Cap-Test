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
  public class TransactionController : Controller
  {
    private readonly ApplicationDbContext context;
    public TransactionController(ApplicationDbContext c) {
      context = c;
    }

    [HttpGet]
    public string Index()
    {
      return "This is the default path. Are you sure you meant to call this?";
    }

    [HttpGet]
    public IEnumerable<Transaction> GetTransactions()
    {
      return context.Transactions
                    .Include(tran => tran.Account)
                    .Include(tran => tran.TransactionType)
                    .ToArray();
    }

    [HttpGet]
    public IEnumerable<Transaction> GetTransactionsForAccountId(int acctId)
    {
      return context.Transactions
                    .Include(tran => tran.TransactionType)
                    .Where(tran => tran.AccountId == acctId)
                    .ToArray();
    }

    [HttpGet]
    public IEnumerable<TransactionType> GetTransactionTypes()
    {
      return context.TransactionTypes
                    .ToArray();
    }

    [HttpPost]
    public Transaction AddTransaction(Transaction pTran)
    {
      Transaction tran = new Transaction
      {
        AccountId = pTran.AccountId,
        TransactionTypeId = pTran.TransactionTypeId,
        Amount = pTran.Amount,
        Date = DateTime.Now
      };

      var entry = context.Transactions.Add(tran);
      context.SaveChanges();
      return entry.Entity;
    }

  }
}
