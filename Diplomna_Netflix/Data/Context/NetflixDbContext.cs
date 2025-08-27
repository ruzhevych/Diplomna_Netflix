using Data.Entities;
using Data.Entities.Auth;
using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Data.Context
{
    public class NetflixDbContext : IdentityDbContext<UserEntity, RoleEntity, long, IdentityUserClaim<long>, UserRoleEntity, IdentityUserLogin<long>, IdentityRoleClaim<long>, IdentityUserToken<long>>
    {
        public NetflixDbContext(DbContextOptions<NetflixDbContext> options)
            : base(options)
        {
        }

        // DbSet-и
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<RoleEntity> Roles { get; set; }
        public DbSet<UserRoleEntity> UserRoles { get; set; }
        public DbSet<SubscriptionEntity> Subscriptions { get; set; }
        public DbSet<RefreshTokenEntity> RefreshTokens { get; set; }
        public DbSet<AdminMessageEntity> AdminMessages { get; set; }
        public DbSet<FavoriteEntity> Favorites { get; set; }
        public DbSet<MediaItem> MediaItems { get; set; }
        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<MovieEntity> Movies { get; set; }
        public DbSet<SeriesEntity> Series { get; set; }
        public DbSet<SeasonEntity> Seasons { get; set; }
        public DbSet<AdminBanEntity> AdminBans { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRoleEntity>(entity =>
            {
                entity.HasKey(ur => new { ur.UserId, ur.RoleId });

                entity.HasOne(ur => ur.User)
                      .WithMany(u => u.UserRoles)
                      .HasForeignKey(ur => ur.UserId)
                      .IsRequired();

                entity.HasOne(ur => ur.Role)
                      .WithMany(r => r.UserRoles)
                      .HasForeignKey(ur => ur.RoleId)
                      .IsRequired();
            });

            builder.Entity<UserEntity>(entity =>
            {
                entity.Property(u => u.FirstName).HasMaxLength(100);
                entity.Property(u => u.LastName).HasMaxLength(100);
                entity.Property(u => u.ProfilePictureUrl).HasMaxLength(300);
            });

            builder.Entity<RoleEntity>(entity =>
            {
                entity.Property(r => r.Name).HasMaxLength(100);
            });
            builder.Entity<RefreshTokenEntity>(entity =>
            {
                entity.HasOne(rt => rt.User)
                      .WithMany(u => u.RefreshTokens)
                      .HasForeignKey(rt => rt.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
            
            builder.Entity<AdminMessageEntity>(entity =>
            {
                entity.HasKey(m => m.Id);

                entity.HasOne(m => m.User)
                    .WithMany(u => u.AdminMessages)
                    .HasForeignKey(m => m.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
