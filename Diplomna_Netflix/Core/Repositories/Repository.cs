using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using Core.Interfaces.Repository;

namespace Core.Repositories;

public class Repository<T> : IRepository<T> where T : class
{
    private readonly DbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T?> GetByIdAsync(object id) 
        => await _dbSet.FindAsync(id);

    public IQueryable<T> GetAllQueryable() 
        => _dbSet.AsQueryable();

    public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? predicate = null)
    {
        if (predicate != null)
            return await _dbSet.Where(predicate).ToListAsync();

        return await _dbSet.ToListAsync();
    }

    public async Task AddAsync(T entity) 
        => await _dbSet.AddAsync(entity);

    public void Update(T entity) 
        => _dbSet.Update(entity);

    public void Delete(T entity) 
        => _dbSet.Remove(entity);

    public async Task DeleteAsync(object id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity != null)
            _dbSet.Remove(entity);
    }

    public async Task<int> SaveChangesAsync() 
        => await _context.SaveChangesAsync();
    public IQueryable<T> Query() 
        => _dbSet.AsNoTracking();
        
    public void RemoveRange(IEnumerable<T> entities) 
        => _dbSet.RemoveRange(entities);
    
    public void UpdateRange(IEnumerable<T> entities) 
        => _dbSet.UpdateRange(entities);

}