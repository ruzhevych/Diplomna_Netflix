namespace Diplomna_Netflix.Core.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDto>> GetAllAsync();
        Task<CategoryDto> GetByIdAsync(int id);
        Task<CategoryDto> CreateAsync(CategoryCreateDto categoryDto);
        Task<bool> UpdateAsync(int id, CategoryUpdateDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}