using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly DbContext _context;
        private readonly DbSet<T> _dbSet;

        public Repository(DbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetByID(object id) => await _dbSet.FindAsync(id);

        public IQueryable<T> GetAllQueryable() => _dbSet;

        public async Task Insert(T entity) => await _dbSet.AddAsync(entity);

        public async Task Update(T entity) => _dbSet.Update(entity);

        public async Task DeleteAsync(object id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
                _dbSet.Remove(entity);
        }

        public async Task SaveAsync() => await _context.SaveChangesAsync();
    }
}