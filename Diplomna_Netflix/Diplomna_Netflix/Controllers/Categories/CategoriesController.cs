using Core.Interfaces.Category;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("api/[controller]")]

public class CategoriesController : ControllerBase
{
   private readonly ICategoryService _categoryService;

    
    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)] // Успішна відповідь
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories);
    }

    
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)] // Якщо категорію не знайдено
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound($"Категорію з Id = {id} не знайдено.");
        }

        return Ok(category);
    }

    
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)] // Якщо передані дані невалідні
    public async Task<ActionResult<CategoryDto>> CreateCategory([FromBody] CategoryCreateDto createDto)
    {
        // Перевірка, чи модель пройшла валідацію (атрибути [Required], [MaxLength] і т.д.)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        
        var newCategory = await _categoryService.CreateAsync(createDto);

        // Повертаємо стандартну відповідь 201 Created.
        // Вона включає URL для доступу до нового ресурсу та сам ресурс у тілі відповіді.
        return CreatedAtAction(nameof(GetCategory), new { id = newCategory.Id }, newCategory);
    }

   
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryUpdateDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var success = await _categoryService.UpdateAsync(id, updateDto);

        if (!success)
        {
            return NotFound($"Категорію з Id = {id} не знайдено для оновлення.");
        }

        // Стандартна відповідь для успішного PUT-запиту - 204 No Content.
        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var success = await _categoryService.DeleteAsync(id);

        if (!success)
        {
            return NotFound($"Категорію з Id = {id} не знайдено для видалення.");
        }

        // Стандартна відповідь для успішного DELETE-запиту - 204 No Content.
        return NoContent();
    }
}