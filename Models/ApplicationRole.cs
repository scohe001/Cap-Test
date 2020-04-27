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

        public static async Task<Dictionary<string, List<ApplicationRole>>> GetAllUsersRoles(UserManager<ApplicationUser> userManager) { 
          var userRoleDict = new Dictionary<string, List<ApplicationRole>>();
          List<ApplicationUser> users = userManager.Users.ToList();

          foreach(ApplicationUser user in users) { 
            userRoleDict[user.Id] = await GetRolesForUser(user, userManager);
          }

          return userRoleDict;
        }

        public static async void SetRolesOnUser(List<string> roleNames, string userId, UserManager<ApplicationUser> userManager) {
          if (roleNames.Any(roleName => RoleList.FirstOrDefault(role => role.Name.Equals(roleName)) == null))
          {
            throw new Exception($"Could not find role.");
          }

          ApplicationUser user = await userManager.FindByIdAsync(userId);
          if(user == null) { throw new Exception($"Could not find user with Id {userId}"); }

          List<string> currentRoles = (await GetRolesForUser(user, userManager)).Select(role => role.Name).ToList();

          List<string> addedRoles = roleNames.Except(currentRoles).ToList();
          List<string> removedRoles = currentRoles.Except(roleNames).ToList();

          var result = await userManager.AddToRolesAsync(user, addedRoles);
          if(!result.Succeeded) { throw new Exception(String.Join(", ", result.Errors.ToList())); }

          result = await userManager.RemoveFromRolesAsync(user, removedRoles);
          if(!result.Succeeded) { throw new Exception(String.Join(", ", result.Errors.ToList())); }
        }

        public static async Task<List<ApplicationRole>> GetRolesForUser(ApplicationUser user, UserManager<ApplicationUser> userManager) { 
          var userRoles = await userManager.GetRolesAsync(user);
          // Map role names to actual roles
          return userRoles.Select(roleName => RoleList.FirstOrDefault(role => role.Name.Equals(roleName))).ToList();
        }
    }
}
