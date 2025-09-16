using Core.Repositories;
using Data.Context;
using Data.Entities;
using Data.Entities.Admin;
using Microsoft.EntityFrameworkCore;

public class BlockedUserRepository : Repository<UserBlockHistoryEntity>, IBlockedUserRepository
{
    private readonly NetflixDbContext _db;

    public BlockedUserRepository(NetflixDbContext db) : base(db)
    {
        _db = db;
    }

    public async Task<UserBlockHistoryEntity?> GetActiveBlockAsync(string userId)
    {
        return await _db.UserBlockHistories
            .Where(b => b.UserId.ToString() == userId && b.IsActive)
            .OrderByDescending(b => b.BlockedAt)
            .FirstOrDefaultAsync();
    }
}