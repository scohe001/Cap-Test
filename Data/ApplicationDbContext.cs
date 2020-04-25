using CreditCache.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CreditCache.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<TransactionType> TransactionTypes { get; set; }
        public DbSet<TransactionDistribution> TransactionDistributions { get; set; }
        public DbSet<RevenueCode> RevenueCodes { get; set; }

        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        // TODO: Add audit stuff here (use comment below)
        public override int SaveChanges()
        {
            var addedAuditedEntities = ChangeTracker.Entries<AuditedEntity>()
              .Where(p => p.State == EntityState.Added)
              .Select(p => p.Entity);

            var modifiedAuditedEntities = ChangeTracker.Entries<AuditedEntity>()
              .Where(p => p.State == EntityState.Modified)
              .Select(p => p.Entity);

            var now = DateTime.UtcNow;

            foreach (var added in addedAuditedEntities) {
                added.CreatedDate = now;
            }

            foreach (var modified in modifiedAuditedEntities) {
                // modified.LastModifiedAt = now;
            }
            return base.SaveChanges();
        }
    }

    public class AuditedEntity {
        public DateTime CreatedDate { get; set; }
    }
}

/*
public interface IAuditedEntity {
  string CreatedBy { get; set; }
  DateTime CreatedAt { get; set; }
  string LastModifiedBy { get; set; }
  DateTime LastModifiedAt { get; set; }
}

public override int SaveChanges() {
  var addedAuditedEntities = ChangeTracker.Entries<IAuditedEntity>()
    .Where(p => p.State == EntityState.Added)
    .Select(p => p.Entity);

  var modifiedAuditedEntities = ChangeTracker.Entries<IAuditedEntity>()
    .Where(p => p.State == EntityState.Modified)
    .Select(p => p.Entity);

  var now = DateTime.UtcNow;

  foreach (var added in addedAuditedEntities) {
    added.CreatedAt = now;
    added.LastModifiedAt = now;
  }

  foreach (var modified in modifiedAuditedEntities) {
    modified.LastModifiedAt = now;
  }

  return base.SaveChanges();
}
*/
