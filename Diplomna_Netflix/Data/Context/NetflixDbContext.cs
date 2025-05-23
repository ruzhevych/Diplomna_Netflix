using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Context
{
    public class NetflixDbContext : DbContext
    {
        public NetflixDbContext(DbContextOptions<NetflixDbContext> options)
            : base(options) {}

        public DbSet<UserEntity> Users { get; set; }
    }
}