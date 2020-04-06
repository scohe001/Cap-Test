using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using thing.Data;

using thing.Dates;

namespace thing.Models
{
  public class Transaction
  {
    #region Properties
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public int AccountId { get; set; }
    [ForeignKey("AccountId")]
    public Account Account { get; set; }

    public decimal Amount { get; set; }

    public decimal NewTotal { get; set; }

    public int TransactionTypeId { get; set; }
    [ForeignKey("TransactionTypeId")]
    public TransactionType TransactionType { get; set; }

    [InverseProperty("Transaction")]
    public List<TransactionDistribution> TransactionDistributions { get; set; }
    #endregion

    #region Static Methods

    #region Creates

    public static Transaction CreateTransaction(Transaction pTran, ApplicationDbContext context) { 
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

    #endregion

    #region Deletes

    public static void DeleteTransaction(int tranId, ApplicationDbContext context) { 
      Transaction tran = context.Transactions.Where(t => t.Id == tranId).FirstOrDefault();
      if(tran == null) { 
        throw new InvalidOperationException("No Transaction with id '" + tranId.ToString() + "' found");
      }

      context.Transactions.Remove(tran);
      context.SaveChanges();
    }

    public static void DeleteTransactionsForAccount(int acctId, ApplicationDbContext context) { 
      foreach(Transaction tran in GetTransactionsForAccount(acctId, context)) {
        DeleteTransaction(tran.Id, context);
      }
    }

    #endregion

    #region Gets

    public static IEnumerable<Transaction> GetAllTransactions(bool isIncludeAccounts, ApplicationDbContext context) { 
      if(isIncludeAccounts) { 
        return context.Transactions
                      .Include(tran => tran.Account)
                      .Include(tran => tran.TransactionType)
                      .ToArray();
      } else { 
        return context.Transactions
                      .Include(tran => tran.TransactionType)
                      .ToArray();
      }
    }

    public static IEnumerable<Transaction> GetTransactionsForAccount(int acctId, ApplicationDbContext context) { 
      return context.Transactions
                    .Include(tran => tran.TransactionType)
                    .Where(tran => tran.AccountId == acctId)
                    .ToArray();
    }

    public static IEnumerable<TransactionType> GetAllTransactionTypes(ApplicationDbContext context) {
      return context.TransactionTypes
                    .ToArray();
    }

    public static IEnumerable<DataPoint<string>> GetTransactionTotals(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      // Initialize Dict
      Dictionary<TransactionType, decimal> tranTotals = new Dictionary<TransactionType, decimal>();
      foreach(TransactionType tranType in context.TransactionTypes) { tranTotals[tranType] = 0; }

      foreach(Transaction tran in GetTransactionsInRange(startDate, endDate, context)) {
        tranTotals[tran.TransactionType] += tran.Amount;
      }

      return tranTotals.Select(pair => new DataPoint<string>() { name = pair.Key.Name, value = pair.Value });
    }

    public static IEnumerable<DataSet<DateTime>> GetTransactionDataByDay(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      return GetTransactionData(startDate, endDate, 
        tran => tran.Date.Date,
        date => date.AddDays(1),
        date => date.Date,
        context);
    }

    public static IEnumerable<DataSet<DateTime>> GetTransactionDataByWeek(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      return GetTransactionData(DateHelper.StartOfWeek(startDate), endDate, 
        tran => new { WeekNum = DateHelper.GetWeekNum(tran.Date.Date), tran.Date.Year },
        date => date.AddDays(7),
        date => DateHelper.StartOfWeek(date.Date),
        context);
    }

    public static IEnumerable<DataSet<DateTime>> GetTransactionDataByMonth(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      return GetTransactionData(new DateTime(startDate.Year, startDate.Month, 1), endDate, 
        tran => new { tran.Date.Month, tran.Date.Year },
        date => date.AddMonths(1),
        date => new DateTime(date.Year, date.Month, 1),
        context);
    }

    public static IEnumerable<DataSet<string>> GetAveragesForWeekDays(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      // Setup dictionary and initialize lists
      Dictionary<TransactionType, List<decimal>> dayTotals = new Dictionary<TransactionType, List<decimal>>();
      foreach(TransactionType tranType in context.TransactionTypes) {
        dayTotals[tranType] = new List<decimal>( new decimal[7] );
      }

      foreach(Transaction tran in GetTransactionsInRange(startDate, endDate, context)) {
        dayTotals[tran.TransactionType][(int)tran.Date.DayOfWeek] += tran.Amount;
      }

      List<DataSet<string>> dataSets = new List<DataSet<string>>();
      for(int day = 0; day < 7; day++) { 
        DataSet<string> dataSet = new DataSet<string>
        {
          name = Enum.GetName(typeof(DayOfWeek), day)
        };

        dataSet.series = dayTotals.Select(pair => new DataPoint<string>() { name = pair.Key.Name, value = pair.Value[day] }).ToList();
        dataSets.Add(dataSet);
      }

      return dataSets;
    }

    #endregion

    #endregion

    #region Helpers

    public static IQueryable<Transaction> GetTransactionsInRange(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      return context.Transactions
          .Where(tran => tran.Date >= startDate && tran.Date <= endDate)
          .OrderBy(tran => tran.Date);
    }

    private static IEnumerable<DataSet<DateTime>> GetTransactionData<T>(DateTime startDate, DateTime endDate, Func<Transaction, T> groupByFunc, Func<DateTime, DateTime> incrementDateFunc, Func<DateTime, DateTime> dateNameFunc, ApplicationDbContext context) {
      List<DataSet<DateTime>> dataSets = new List<DataSet<DateTime>>();
      IQueryable<Transaction> transInDateRange = GetTransactionsInRange(startDate, endDate, context);
      foreach (TransactionType tranType in context.TransactionTypes) {
        DataSet<DateTime> dataSet = new DataSet<DateTime>
        {
          name = tranType.Name,
          series = new List<DataPoint<DateTime>>()
        };

        // These guys are split up to make debugging easier
        // IEnumerable<Transaction> transOfType = transInDateRange.Where(tran => tran.TransactionType.Equals(tranType));
        // var groupByWeek = transOfType.GroupBy(groupByFunc);
        // dataSet.series = groupByWeek.Select(trans => new DataPoint() { name = DateHelper.StartOfWeek(trans.FirstOrDefault().Date), value = trans.Sum(tran => tran.Amount) }).ToList();

        dataSet.series = transInDateRange
            .Where(tran => tran.TransactionType.Equals(tranType))
            .GroupBy(groupByFunc)
            .Select(trans => new DataPoint<DateTime>() { name = dateNameFunc(trans.FirstOrDefault().Date).Date, value = trans.Sum(tran => tran.Amount) })
            .ToList();

        for (var day = startDate.Date; day.Date <= endDate.Date; day = incrementDateFunc(day)) { 
          // It exists, we're good
          if (dataSet.series.Any(dataPoint => dataPoint.name.Date.Equals(dateNameFunc(day.Date)))) { continue; }
          // Else, add a 0 value
          dataSet.series.Add(new DataPoint<DateTime>() { name = day.Date, value = 0 });
        }
        dataSets.Add(dataSet);
      }
      return dataSets;
    }

    #endregion
  }
}
