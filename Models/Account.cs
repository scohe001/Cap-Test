using System;
using System.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using CreditCache.Data;

namespace CreditCache.Models
{
  public class Account: AuditedEntity
  {
    #region Properties

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }

    public string PhoneNumber { get; set; }
    public string Notes { get; set; }

    public decimal Total { get; set; }

    [InverseProperty("Account")]
    public List<Transaction> Transactions { get; set; }

    #endregion

    #region Constructors
    public Account() { }
    public Account(string pFirstName, string pLastName)
    {
      FirstName = new string(pFirstName);
      LastName = new string(pLastName);
    }
    #endregion

    #region Static Methods

    #region Creates

    public static Account CreateAccount(Account a, ApplicationDbContext context) {
      var accountSaved = context.Accounts.Add(a);
      context.SaveChanges();
      return accountSaved.Entity;
    }

    public static Account CreateAccount(string firstName, string lastName, ApplicationDbContext context) {
      return CreateAccount(new Account(firstName, lastName), context);
    }

    #endregion

    #region Gets

    public static IEnumerable<Account> GetAllAccounts(bool isIncludeRelatedData, ApplicationDbContext context) {
      if (!isIncludeRelatedData) { return context.Accounts.OrderBy(acct => acct.FirstName.ToLower() + acct.LastName.ToLower()).ToArray(); }

      return context.Accounts
                    .Include(acct => acct.Transactions)
                        .ThenInclude(tran => tran.TransactionType)
                    .Include(acct => acct.Transactions)
                        .ThenInclude(tran => tran.TransactionDistributions)
                            .ThenInclude(tranDist => tranDist.RevenueCode)
                    .ToArray();
    }

    public static Account GetSingleAccount(int acctId, ApplicationDbContext context) { 
      return context.Accounts
                    .Include(acct => acct.Transactions)
                        .ThenInclude(tran => tran.TransactionType)
                    .Include(acct => acct.Transactions)
                        .ThenInclude(tran => tran.TransactionDistributions)
                            .ThenInclude(tranDist => tranDist.RevenueCode)
                    .Where(acct => acct.Id == acctId)
                    .FirstOrDefault();
    }

    #endregion

    #region Deletes

    public static void DeleteSingleAccount(int acctId, ApplicationDbContext context) {
      Account acct = context.Accounts.Where(a => a.Id == acctId).FirstOrDefault();
      if(acct == null) { 
        throw new InvalidOperationException("No Account with id '" + acctId.ToString() + "' found");
      }

      context.Accounts.Remove(acct);
      context.SaveChanges();
    }

    #endregion

    #endregion
  }
}
