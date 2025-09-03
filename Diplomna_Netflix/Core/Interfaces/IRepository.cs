using System.Linq.Expressions;

namespace Core.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T?> GetByIdAsync(object id);

        IQueryable<T> GetAllQueryable();

        Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null);

        Task AddAsync(T entity);

        void Update(T entity);

        void Delete(T entity);

        Task DeleteAsync(object id);

        Task SaveChangesAsync();
    }
}