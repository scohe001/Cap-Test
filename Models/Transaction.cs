using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using thing.Data;

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

    public int TransactionTypeId { get; set; }
    [ForeignKey("TransactionTypeId")]
    public TransactionType TransactionType { get; set; }
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

    #endregion

    #endregion
  }
}
