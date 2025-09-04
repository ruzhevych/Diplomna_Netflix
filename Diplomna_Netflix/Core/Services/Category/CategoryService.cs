using Core.Interfaces.Category;
using Data.Context;

namespace Core.Services.Category;

public class CategoryService : ICategoryService
{
   private readonly NetflixDbContext _context;

    public CategoryService(NetflixDbContext context)
    {
        _context = context;
    }

    
    public async Task<CategoryDto> CreateAsync(CategoryCreateDto createDto)
    {
        var categoryEntity = new CategoryEntity
        {
            Name = createDto.Name,
            ExternalApiId = createDto.ExternalApiId,
            ParentCategoryId = createDto.ParentCategoryId
        };

        _context.Categories.Add(categoryEntity);
        await _context.SaveChangesAsync();

        return MapToDto(categoryEntity); // MapToDto залишається без змін
    }

    public Task<bool> DeleteAsync(int id)
    {
        throw new NotImplementedException();
    }

    public Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        throw new NotImplementedException();
    }

    public Task<CategoryDto> GetByIdAsync(int id)
    {
        throw new NotImplementedException();
    }

    // UPDATE - тепер приймає UpdateCategoryDto
    public async Task<bool> UpdateAsync(int id, CategoryUpdateDto updateDto)
    {
        var categoryToUpdate = await _context.Categories.FindAsync(id);

        if (categoryToUpdate == null)
        {
            return false;
        }

        categoryToUpdate.Name = updateDto.Name;
        categoryToUpdate.ExternalApiId = updateDto.ExternalApiId;
        categoryToUpdate.ParentCategoryId = updateDto.ParentCategoryId;

        await _context.SaveChangesAsync();
        return true;
    }

    private CategoryDto MapToDto(CategoryEntity entity)
    {
        return new CategoryDto
        {
            Id = entity.Id,
            Name = entity.Name,
            ExternalApiId = entity.ExternalApiId,
            ParentCategoryId = entity.ParentCategoryId
        };
    }
}