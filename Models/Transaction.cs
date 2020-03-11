using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace thing.Models
{
  public class Transaction
  {
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
  }
}
