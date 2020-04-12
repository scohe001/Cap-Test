using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace thing.Models
{
  public class TransactionType
  {
    #region Properties
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Required]
    public bool IsSystemType { get; set; }
    #endregion

    #region Typedef

    public const int RESALE_ID = 1;
    public const int RETURN_ID = 2;
    public const int PURCHASE_ID = 3;
    public const int CASHOUT_ID = 4;
    public const int CASHOUT_DEDUCTION_ID = 5;
    public const int CREDIT_EXPIRATION_ID = 6;

    #endregion
  }
}
