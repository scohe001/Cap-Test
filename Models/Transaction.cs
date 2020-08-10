using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net;

using CreditCache.Data;
using CreditCache.Dates;
using CreditCache.Common;

namespace CreditCache.Models
{
  public class Transaction: AuditedEntity
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

    public static void CreateTransaction(Transaction pTran, ApplicationDbContext context) {
      if(pTran.Amount == 0) { throw new ForbiddenException("Transaction amount may not be '$0.00'. Trivial transactions are disallowed."); }

      Account account = Account.GetSingleAccount(pTran.AccountId, context);
      if(account == null) { throw new NotFoundException("Could not find account with Id: " + pTran.AccountId.ToString()); } // Bad Id passed

      // New tran can't be before the most recent tran on the account
      Transaction mostRecentTran = account.Transactions.OrderByDescending(tran => tran.Date).FirstOrDefault();
      if(mostRecentTran != null && mostRecentTran.Date > pTran.Date) { throw new ForbiddenException("Transaction Date must not be before the most recent transaction on the Account."); }

      // TODO: Setup some kind of Guid key for the acct and check here if it matches
      //        (if check fails, return 409 Conflict status code, since someone else has made a tran in the meantime...)

      decimal currentResaleTotal = account.Transactions.Sum(tran => tran.TransactionDistributions.Where(tranDist => tranDist.RevenueCodeId == RevenueCode.RESALE_ID).Sum(tranDist => tranDist.Amount));
      decimal currentReturnTotal = account.Transactions.Sum(tran => tran.TransactionDistributions.Where(tranDist => tranDist.RevenueCodeId == RevenueCode.RETURN_ID).Sum(tranDist => tranDist.Amount));

      TransactionDelegate tranHandler = null;
      switch(pTran.TransactionTypeId) {
        case TransactionType.RESALE_ID:
          tranHandler = CreateResale;
          break;
        case TransactionType.RETURN_ID:
          tranHandler = CreateReturn;
          break;
        case TransactionType.PURCHASE_ID:
          tranHandler = CreatePurchase;
          break;
        case TransactionType.CASHOUT_ID:
          if(currentResaleTotal <= 0) { 
            throw new ForbiddenException("Cannot cashout an account with a 0 balance in resales--nothing to cashout.");
          }
          tranHandler = CreateCashout;
          break;
        default:
          throw new NotFoundException($"Could not find TransactionType with Id: {pTran.TransactionTypeId}."); // Bad transaction type Id!
      }

      if(pTran.Amount + currentResaleTotal + currentReturnTotal < 0) { 
        throw new ForbiddenException("Transaction results in an Account balance less than $0.00.");
      }
      tranHandler(pTran.Amount, currentResaleTotal, currentReturnTotal, pTran.AccountId, pTran.Date, context);

      // Update total amount on the Account itself
      account.Total = pTran.Amount + currentResaleTotal + currentReturnTotal;
      context.SaveChanges();
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
      foreach(TransactionType tranType in context.TransactionTypes.Where(tt => !tt.IsSystemType)) { tranTotals[tranType] = 0; }

      foreach(Transaction tran in GetTransactionsInRange(startDate, endDate, context)) {
        tranTotals[tran.TransactionType] += Math.Abs(tran.Amount);
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
      foreach(TransactionType tranType in context.TransactionTypes.Where(tt => !tt.IsSystemType)) {
        dayTotals[tranType] = new List<decimal>( new decimal[7] );
      }

      foreach(Transaction tran in GetTransactionsInRange(startDate, endDate, context)) {
        dayTotals[tran.TransactionType][(int)tran.Date.DayOfWeek] += Math.Abs(tran.Amount);
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

    #region Helpers for analytics

    public static IQueryable<Transaction> GetTransactionsInRange(DateTime startDate, DateTime endDate, ApplicationDbContext context) {
      return context.Transactions
          .Where(tran => tran.Date >= startDate && tran.Date <= endDate && !tran.TransactionType.IsSystemType)
          .OrderBy(tran => tran.Date);
    }

    private static IEnumerable<DataSet<DateTime>> GetTransactionData<T>(DateTime startDate, DateTime endDate, Func<Transaction, T> groupByFunc, Func<DateTime, DateTime> incrementDateFunc, Func<DateTime, DateTime> dateNameFunc, ApplicationDbContext context) {
      List<DataSet<DateTime>> dataSets = new List<DataSet<DateTime>>();
      IQueryable<Transaction> transInDateRange = GetTransactionsInRange(startDate, endDate, context);
      foreach (TransactionType tranType in context.TransactionTypes.Where(tt => !tt.IsSystemType)) {
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
            .Select(trans => new DataPoint<DateTime>() { name = dateNameFunc(trans.FirstOrDefault().Date).Date, value = trans.Sum(tran => Math.Abs(tran.Amount)) })
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

    #region Helpers for creates

    private delegate void TransactionDelegate(decimal val, decimal resaleTotal, decimal returnTotal, int acctId, DateTime date, ApplicationDbContext context);

    private static void CreateCashout(decimal _, decimal resaleTotal, decimal returnTotal, int acctId, DateTime date, ApplicationDbContext context) {
      decimal val = -resaleTotal;

      decimal baseVal = Math.Round(val * CASHOUT_DISCOUNT, 2);
      decimal discountVal = val - baseVal;
      Transaction baseT = new Transaction
      {
        AccountId = acctId,
        Amount = baseVal,
        Date = date,
        NewTotal = returnTotal - discountVal,
        TransactionTypeId = TransactionType.CASHOUT_ID
      };
      baseT = context.Add(baseT).Entity;
      context.SaveChanges();

      TransactionDistribution baseTD = new TransactionDistribution
      {
        AccountId = acctId,
        Amount = baseVal,
        NewAccountRevenueTotal = -discountVal,
        TransactionId = baseT.Id,
        RevenueCodeId = RevenueCode.RESALE_ID
      };
      context.Add(baseTD);

      Transaction discountT = new Transaction
      {
        AccountId = acctId,
        Amount = discountVal,
        Date = date,
        NewTotal = returnTotal,
        TransactionTypeId = TransactionType.CASHOUT_DEDUCTION_ID
      };
      discountT = context.Add(discountT).Entity;
      context.SaveChanges();

      TransactionDistribution discountTD = new TransactionDistribution
      {
        AccountId = acctId,
        Amount = discountVal,
        NewAccountRevenueTotal = 0M,
        TransactionId = discountT.Id,
        RevenueCodeId = RevenueCode.RESALE_ID
      };
      context.Add(discountTD);
      context.SaveChanges();
    }

    // resaleTotal/returnTotal are BEFORE val
    private static void CreatePurchase(decimal val, decimal resaleTotal, decimal returnTotal, int acctId, DateTime date, ApplicationDbContext context) {
      Transaction t = new Transaction
      {
        AccountId = acctId,
        Amount = val,
        Date = date,
        NewTotal = val + resaleTotal + returnTotal,
        TransactionTypeId = TransactionType.PURCHASE_ID
      };
      t = context.Add(t).Entity;
      context.SaveChanges();

      if(returnTotal + val < 0) {
        if (returnTotal > 0)
        {
          TransactionDistribution td = new TransactionDistribution
          {
            AccountId = acctId,
            Amount = -returnTotal,
            NewAccountRevenueTotal = 0,
            TransactionId = t.Id,
            RevenueCodeId = RevenueCode.RETURN_ID
          };
          context.Add(td);
        }

        resaleTotal += returnTotal + val;

        TransactionDistribution resaleTD = new TransactionDistribution
        {
          AccountId = acctId,
          Amount = returnTotal + val,
          NewAccountRevenueTotal = resaleTotal + returnTotal + val,
          TransactionId = t.Id,
          RevenueCodeId = RevenueCode.RESALE_ID
        };
        context.Add(resaleTD);
      }
      else { 
        TransactionDistribution td = new TransactionDistribution
        {
          AccountId = acctId,
          Amount = val,
          NewAccountRevenueTotal = returnTotal + val,
          TransactionId = t.Id,
          RevenueCodeId = RevenueCode.RETURN_ID
        };
        context.Add(td);
      }
      context.SaveChanges();
    }

    // resaleTotal is AFTER val
    private static void CreateResale(decimal val, decimal resaleTotal, decimal returnTotal, int acctId, DateTime date, ApplicationDbContext context) { 
      Transaction t = new Transaction
      {
        AccountId = acctId,
        Amount = val,
        Date = date,
        NewTotal = val + resaleTotal + returnTotal,
        TransactionTypeId = TransactionType.RESALE_ID
      };
      t = context.Add(t).Entity;
      context.SaveChanges();

      TransactionDistribution td = new TransactionDistribution
      {
        AccountId = acctId,
        Amount = val,
        NewAccountRevenueTotal = resaleTotal + val,
        TransactionId = t.Id,
        RevenueCodeId = RevenueCode.RESALE_ID
      };
      context.Add(td);
      context.SaveChanges();
    }

    // returnTotal is AFTER val
    private static void CreateReturn(decimal val, decimal resaleTotal, decimal returnTotal, int acctId, DateTime date, ApplicationDbContext context) { 
      Transaction t = new Transaction
      {
        AccountId = acctId,
        Amount = val,
        Date = date,
        NewTotal = val + resaleTotal + returnTotal,
        TransactionTypeId = TransactionType.RETURN_ID
      };
      t = context.Add(t).Entity;
      context.SaveChanges();

      TransactionDistribution td = new TransactionDistribution
      {
        AccountId = acctId,
        Amount = val,
        NewAccountRevenueTotal = returnTotal + val,
        TransactionId = t.Id,
        RevenueCodeId = RevenueCode.RETURN_ID
      };
      context.Add(td);
      context.SaveChanges();
    }

    #endregion

    #region Constants

    public const decimal CASHOUT_DISCOUNT = .8M;

    #endregion

    #endregion
  }
}
