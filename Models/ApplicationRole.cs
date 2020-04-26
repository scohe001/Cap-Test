using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreditCache.Models
{
    public class ApplicationRole : IdentityRole
    {
        // Required ctro with no arguments so it can be added as a model to 
        //   the db. Bleh. Should never actually be called
        public ApplicationRole() : base("")
        {
          this.Description = "";
        }

        public ApplicationRole(string roleName) : base(roleName)
        {
          this.Description = "";
        }

        public ApplicationRole(string roleName, string desc) : base(roleName)
        {
          this.Description = desc;
        }

        public string Description { get; set; }

        public static List<ApplicationRole> RoleList = new List<ApplicationRole>() {
          new ApplicationRole("Admin", "System Admin. Has full access to everything"),
          new ApplicationRole("Employee", "Has access to Accounts/Transactions"),
          new ApplicationRole("Unregistered", "Has no access. Must be \"Registered\" by an admin")
        };
    }
}
