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


    // By days
    [HttpGet]
    public IEnumerable<DataSet> GetTransactionDataByDays(DateTime startDate, DateTime endDate) {
      using ApplicationDbContext context = new ApplicationDbContext();

      List<DataSet> dataSets = new List<DataSet>();
      foreach (TransactionType tranType in context.TransactionTypes) {
        DataSet dataSet = new DataSet
        {
          name = tranType.Name,
          series = new List<DataPoint>()
        };

        IEnumerable<Transaction> transInDateRange = context.Transactions.Where(tran => tran.Date >= startDate && tran.Date <= endDate && tran.TransactionType.Equals(tranType)).OrderBy(tran => tran.Date);
        var groupByWeek = transInDateRange.GroupBy(tran => tran.Date.Date);
        dataSet.series = groupByWeek.Select(trans => new DataPoint() { name = trans.FirstOrDefault().Date.Date, value = trans.Sum(tran => tran.Amount) }).ToList();
        for (var day = startDate.Date; day.Date <= endDate.Date; day = day.AddDays(1)) { 
          // It exists, we're good
          if (dataSet.series.Any(dataPoint => dataPoint.name.Date.Equals(day.Date))) { continue; }
          // Else, add a 0 value
          dataSet.series.Add(new DataPoint() { name = day.Date, value = 0 });
        }
        dataSets.Add(dataSet);
      }
      return dataSets;
    }

    [HttpGet]
    public IEnumerable<DataSet> GetTransactionDataByMonths(DateTime startDate, DateTime endDate) {
      using ApplicationDbContext context = new ApplicationDbContext();

      List<DataSet> dataSets = new List<DataSet>();
      foreach (TransactionType tranType in context.TransactionTypes) {
        DataSet dataSet = new DataSet
        {
          name = tranType.Name,
          series = new List<DataPoint>()
        };

        IEnumerable<Transaction> transInDateRange = context.Transactions.Where(tran => tran.Date >= startDate && tran.Date <= endDate && tran.TransactionType.Equals(tranType)).OrderBy(tran => tran.Date);
        var groupByWeek = transInDateRange.GroupBy(tran => new { tran.Date.Month, tran.Date.Year });
        dataSet.series = groupByWeek.Select(trans => new DataPoint() { name = StartOfWeek(trans.FirstOrDefault().Date), value = trans.Sum(tran => tran.Amount) }).ToList();
        for (var day = startDate.Date; day.Date <= endDate.Date; day = day.AddMonths(1)) { 
          // It exists, we're good
          if (dataSet.series.Any(dataPoint => dataPoint.name.Month == day.Month && dataPoint.name.Year == day.Year)) { continue; }
          // Else, add a 0 value
          dataSet.series.Add(new DataPoint() { name = day.Date, value = 0 });
        }
        dataSets.Add(dataSet);
      }
      return dataSets;
    }

    [HttpGet]
    public IEnumerable<DataSet> GetTransactionDataByWeeks(DateTime startDate, DateTime endDate) {
      using ApplicationDbContext context = new ApplicationDbContext();

      List<DataSet> dataSets = new List<DataSet>();
      foreach (TransactionType tranType in context.TransactionTypes) {
        DataSet dataSet = new DataSet
        {
          name = tranType.Name,
          series = new List<DataPoint>()
        };
        // dataSet.series = context.Transactions.Where(tran => tran.Date >= startDate && tran.Date <= endDate && tran.TransactionType.Equals(tranType)).ToList().GroupBy(tran => GetWeekNum(tran.Date)).Select(trans => new DataPoint() { name = trans.FirstOrDefault().Date.ToShortDateString(), value = trans.Sum(tran => tran.Amount) }).ToList();

        IEnumerable<Transaction> transInDateRange = context.Transactions.Where(tran => tran.Date >= startDate && tran.Date <= endDate && tran.TransactionType.Equals(tranType)).OrderBy(tran => tran.Date);
        var groupByWeek = transInDateRange.GroupBy(tran => new { WeekNum = GetWeekNum(tran.Date), tran.Date.Year });
        dataSet.series = groupByWeek.Select(trans => new DataPoint() { name = StartOfWeek(trans.FirstOrDefault().Date), value = trans.Sum(tran => tran.Amount) }).ToList();
        for (var day = startDate.Date; day.Date <= endDate.Date; day = day.AddDays(7)) { 
          // It exists, we're good
          if (dataSet.series.Any(dataPoint => dataPoint.name.Date.Equals(StartOfWeek(day.Date)))) { continue; }
          // Else, add a 0 value
          dataSet.series.Add(new DataPoint() { name = day.Date, value = 0 });
        }
        dataSets.Add(dataSet);
      }
      return dataSets;
    }

    // Really need to stick these two somewhere nice
    private int GetWeekNum(DateTime dateTime) { 
        // Gets the Calendar instance associated with a CultureInfo.
        CultureInfo myCI = new CultureInfo("en-US");
        Calendar myCal = myCI.Calendar;

        // Gets the DTFI properties required by GetWeekOfYear.
        CalendarWeekRule myCWR = myCI.DateTimeFormat.CalendarWeekRule;
        DayOfWeek myFirstDOW = myCI.DateTimeFormat.FirstDayOfWeek;

        return myCal.GetWeekOfYear(dateTime, myCWR, myFirstDOW);
    }

    private DateTime StartOfWeek(DateTime dt)
    {
        // Gets the Calendar instance associated with a CultureInfo.
        CultureInfo myCI = new CultureInfo("en-US");
        Calendar myCal = myCI.Calendar;

        // Gets the DTFI properties required by GetWeekOfYear.
        CalendarWeekRule myCWR = myCI.DateTimeFormat.CalendarWeekRule;
        DayOfWeek myFirstDOW = myCI.DateTimeFormat.FirstDayOfWeek;

        int diff = (7 + (dt.DayOfWeek - myFirstDOW)) % 7;
        return dt.AddDays(-1 * diff).Date;
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

  public class DataPoint {
    // Really a string, but we're doing date so we can work with it easier
    // public string name;
    public DateTime name;
    public decimal value;
  }

  public class DataSet {
    public string name;
    public List<DataPoint> series;
  }
}
