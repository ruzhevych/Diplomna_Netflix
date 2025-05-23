using System.Linq.Expressions;

namespace Core.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByID(object id);
        IQueryable<T> GetAllQueryable();
        Task Insert(T entity);
        Task Update(T entity);
        Task DeleteAsync(object id);
        Task SaveAsync();
    }
}