using Core.Interfaces.Repository;
using Data.Entities.Admin;

public interface IBlockedUserRepository : IRepository<UserBlockHistoryEntity>
{
    Task<UserBlockHistoryEntity?> GetActiveBlockAsync(string userId);
}