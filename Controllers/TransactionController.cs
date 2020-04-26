using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using System.Globalization;
using Microsoft.AspNetCore.Http;

using CreditCache.Data;
using CreditCache.Models;
using CreditCache.Common;

namespace CreditCache.Controllers
{
  [Authorize(Roles = "Admin")]
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

    // Maybe make this return IActionResult<Transaction> and then have CreateTransaction
    //   return a Transaction on success for us to give back??
    [HttpPost]
    public IActionResult AddTransaction(Transaction pTran)
    {
      try { 
        Transaction.CreateTransaction(pTran, context);
        return Ok();
      }
      catch(ForbiddenException e) { 
        return StatusCode(StatusCodes.Status403Forbidden, e.Message);
      }
      catch(NotFoundException e) { 
        return NotFound(e.Message);
      }
    }

    #region Gets for analytics

    [HttpGet]
    public IEnumerable<DataSet<DateTime>> GetTransactionDataByDays(DateTime startDate, DateTime endDate) {
      return Transaction.GetTransactionDataByDay(startDate, endDate, context);
    }

    [HttpGet]
    public IEnumerable<DataSet<DateTime>> GetTransactionDataByMonths(DateTime startDate, DateTime endDate) {
      return Transaction.GetTransactionDataByMonth(startDate, endDate, context);
    }

    [HttpGet]
    public IEnumerable<DataSet<DateTime>> GetTransactionDataByWeeks(DateTime startDate, DateTime endDate) {
      return Transaction.GetTransactionDataByWeek(startDate, endDate, context);
    }

    [HttpGet]
    public IEnumerable<DataSet<string>> GetAveragesForWeekDays(DateTime startDate, DateTime endDate) {
      return Transaction.GetAveragesForWeekDays(startDate, endDate, context);
    }

    [HttpGet]
    public IEnumerable<DataPoint<string>> GetTransactionTotals(DateTime startDate, DateTime endDate) {
      return Transaction.GetTransactionTotals(startDate, endDate, context);
    }

    #endregion

  }
}
