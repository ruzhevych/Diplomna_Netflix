using System.Linq.Expressions;

namespace Core.Interfaces.Repository;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(object id);

    IQueryable<T> GetAllQueryable();

    Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null);

    Task AddAsync(T entity);

    void Update(T entity);

    void Delete(T entity);

    Task DeleteAsync(object id);

    Task<int> SaveChangesAsync();
    IQueryable<T> Query();
    void RemoveRange(IEnumerable<T> entities);
}