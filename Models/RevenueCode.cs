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
  public class RevenueCode
  {
    #region Properties
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    #endregion

    #region Typedef

    public const int RESALE_ID = 1;
    public const int RETURN_ID = 2;

    #endregion
  }
}
