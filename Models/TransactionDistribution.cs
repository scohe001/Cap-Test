using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using CreditCache.Data;
using CreditCache.Dates;

namespace CreditCache.Models
{
  public class TransactionDistribution: AuditedEntity
  {
    #region Properties
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }

    public int AccountId { get; set; }
    [ForeignKey("AccountId")]
    public Account Account { get; set; }

    public decimal Amount { get; set; }

    public decimal NewAccountRevenueTotal { get; set; }

    public int TransactionId { get; set; }
    [ForeignKey("TransactionId")]
    public Transaction Transaction { get; set; }

    public int RevenueCodeId { get; set; }
    [ForeignKey("RevenueCodeId")]
    public RevenueCode RevenueCode { get; set; }

    #endregion

    public TransactionDistribution()
    {
    }
  }
}
