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
      return Transaction.GetAllTransactions(true, context);
    }

    [HttpGet]
    public IEnumerable<Transaction> GetTransactionsForAccountId(int acctId)
    {
      return Transaction.GetTransactionsForAccount(acctId, context);
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
      return Transaction.CreateTransaction(pTran, context);
    }

  }
}