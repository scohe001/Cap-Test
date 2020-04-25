using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;

using System.Globalization;
using System.IO;
using Newtonsoft.Json;

using CreditCache.Data;
using CreditCache.Models;

namespace CreditCache.Controllers
{
  [Authorize]
  [ApiController]
  [Route("{controller=Home}/{action=Index}/{id?}")] //This is cheating. Should really be routing each method individually
  public class CommonController : Controller
  {
    private readonly ApplicationDbContext context;
    public CommonController(ApplicationDbContext c) {
      context = c;
    }

    [HttpGet]
    public Dictionary<string, string> GetVersionString() {
      Assembly assembly = Assembly.GetExecutingAssembly();
      FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
      Dictionary<string, string> versionDict = new Dictionary<string, string>();
      versionDict["Version"] = fileVersionInfo.ProductVersion;
      return versionDict;
    }

    // To convert credits over. This is a pretty hacky job. Going to need to do it better when it's for real
    // Commenting out HttpPost and making private so it can't be called...
    [HttpPost]
    public IActionResult Convert() {
      ClearAll();

      CreateTransactionTypes();
      CreateRevenueCodes();
      context.SaveChanges();

      using StreamReader streamReader = System.IO.File.OpenText("/Users/aricohen/Desktop/dev/Credit Cache/Credits.json");
      //var thing = (Dictionary<string, object>)JsonSerializer.Create().Deserialize(streamReader.ReadToEnd());
      string txt = streamReader.ReadToEnd();
      dynamic thing = JsonConvert.DeserializeObject(txt);
      Console.WriteLine(thing[0]);

      foreach(dynamic cust in thing) {
        Account acct = new Account
        {
          FirstName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(cust.firstName.ToString().Trim().ToLower()),
          LastName = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(cust.lastName.ToString().Trim().ToLower()),
          PhoneNumber = cust.phoneNumber,
          Notes = cust.notes,
          Total = cust.balance
        };

        acct = context.Accounts.Add(acct).Entity;
        context.SaveChanges();

        decimal runningTotal = 0;
        decimal resaleTotal = 0;
        decimal returnTotal = 0;

        foreach(dynamic action in cust.Actions) {
          DateTime actionDate = DateTime.ParseExact(action.date.ToString(), "MM/dd/yy", CultureInfo.InvariantCulture);

          string actionType = action.transaction;
          TransactionType tranType = context.TransactionTypes.FirstOrDefault(tt => tt.Name == actionType);

          decimal oldResale = resaleTotal;
          decimal oldReturn = returnTotal;
          decimal val = action.theValue;
          val = Math.Round(val, 2); // Do this after the assignment of the dynamic type so C# knows it's a decimal

          if (tranType.Id == TransactionType.RESALE_ID) {
            resaleTotal += val;
            runningTotal += val;
            CreateResale(val, resaleTotal, runningTotal, acct.Id, actionDate);
          }
          else if (tranType.Id == TransactionType.RETURN_ID) {
            returnTotal += val;
            runningTotal += val;
            CreateReturn(val, returnTotal, runningTotal, acct.Id, actionDate);
          }
          else if (tranType.Id == TransactionType.PURCHASE_ID) {
            val = -val;
            runningTotal += val;
            CreatePurchase(val, returnTotal, resaleTotal, runningTotal, acct.Id, actionDate);
            returnTotal += val;
            if(returnTotal < 0) { // Hit returns first, then roll into resales
              resaleTotal += returnTotal;
              returnTotal = 0;
            }
          }
          else if (tranType.Id == TransactionType.CASHOUT_ID) {
            val = -resaleTotal; // 1.25 = 5/4 = 1/.8 Basically reverse the .8 calculation
            resaleTotal = 0;
            runningTotal += val;
            CreateCashout(val, runningTotal, acct.Id, actionDate);
          }
        }

        context.SaveChanges();
      }


      return Ok();
    }

    private void CreateCashout(decimal val, decimal runningTotal, int acctId, DateTime date) {
      decimal baseVal = Math.Round(val * .8M, 2);
      decimal discountVal = val - baseVal;
      Transaction baseT = new Transaction
      {
        AccountId = acctId,
        Amount = baseVal,
        Date = date,
        NewTotal = runningTotal - discountVal,
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
        NewTotal = runningTotal,
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
    private void CreatePurchase(decimal val, decimal returnTotal, decimal resaleTotal, decimal runningTotal, int acctId, DateTime date) {
      Transaction t = new Transaction
      {
        AccountId = acctId,
        Amount = val,
        Date = date,
        NewTotal = runningTotal,
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
          NewAccountRevenueTotal = resaleTotal,
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
    private void CreateResale(decimal val, decimal resaleTotal, decimal runningTotal, int acctId, DateTime date) { 
      Transaction t = new Transaction
      {
        AccountId = acctId,
        Amount = val,
        Date = date,
        NewTotal = runningTotal,
        TransactionTypeId = TransactionType.RESALE_ID
      };
      t = context.Add(t).Entity;
      context.SaveChanges();

      TransactionDistribution td = new TransactionDistribution
      {
        AccountId = acctId,
        Amount = val,
        NewAccountRevenueTotal = resaleTotal,
        TransactionId = t.Id,
        RevenueCodeId = RevenueCode.RESALE_ID
      };
      context.Add(td);
      context.SaveChanges();
    }

    // returnTotal is AFTER val
    private void CreateReturn(decimal val, decimal returnTotal, decimal runningTotal, int acctId, DateTime date) { 
      Transaction t = new Transaction
      {
        AccountId = acctId,
        Amount = val,
        Date = date,
        NewTotal = runningTotal,
        TransactionTypeId = TransactionType.RETURN_ID
      };
      t = context.Add(t).Entity;
      context.SaveChanges();

      TransactionDistribution td = new TransactionDistribution
      {
        AccountId = acctId,
        Amount = val,
        NewAccountRevenueTotal = returnTotal,
        TransactionId = t.Id,
        RevenueCodeId = RevenueCode.RETURN_ID
      };
      context.Add(td);
      context.SaveChanges();
    }

    private void ClearAll() {
      string[] tableNames = { "Accounts", "RevenueCodes", "TransactionDistributions", "TransactionTypes", "Transactions" };
      foreach( string table in tableNames ) {
        context.Database.ExecuteSqlRaw($"delete from {table}");
      }

    }

    private void CreateTransactionTypes() {
      TransactionType tc = new TransactionType
      {
        Id = TransactionType.RESALE_ID,
        Name = "Resale",
        IsSystemType = false
      };
      context.Add(tc);

      tc = new TransactionType
      {
        Id = TransactionType.RETURN_ID,
        Name = "Return",
        IsSystemType = false
      };
      context.Add(tc);

      tc = new TransactionType
      {
        Id = TransactionType.PURCHASE_ID,
        Name = "Purchase",
        IsSystemType = false
      };
      context.Add(tc);
    
      tc = new TransactionType
      {
        Id = TransactionType.CASHOUT_ID,
        Name = "Cash Out",
        IsSystemType = false
      };
      context.Add(tc);

      tc = new TransactionType
      {
        Id = TransactionType.CASHOUT_DEDUCTION_ID,
        Name = "Cashout Deduction",
        IsSystemType = true
      };
      context.Add(tc);

      tc = new TransactionType
      {
        Id = TransactionType.CREDIT_EXPIRATION_ID,
        Name = "Credit Expiration",
        IsSystemType = true
      };
      context.Add(tc);
    }

    private void CreateRevenueCodes() { 
      RevenueCode rc = new RevenueCode
      {
        Id = RevenueCode.RESALE_ID,
        Name = "Resales",
        Description = "Resale total"
      };
      context.Add(rc);
      
      rc = new RevenueCode
      {
        Id = RevenueCode.RETURN_ID,
        Name = "Returns",
        Description = "Return total"
      };

      context.Add(rc);
    }
  }
}
