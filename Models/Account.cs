using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;


namespace thing.Models
{
  public class Account
  {
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }

    public string PhoneNumber { get; set; }
    public string Notes { get; set; }

    public Account() { }
    public Account(string pFirstName, string pLastName)
    {
      FirstName = new string(pFirstName);
      LastName = new string(pLastName);
    }
  }
}
