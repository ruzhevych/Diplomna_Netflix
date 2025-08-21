

using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
public class CategoryCreateDto
{
    [Required(ErrorMessage = "Назва є обов'язковою.")]
    [MaxLength(100, ErrorMessage = "Назва не може перевищувати 100 символів.")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Зовнішній ID є обов'язковим.")]
    public int ExternalApiId { get; set; }
    public int? ParentCategoryId { get; set; }
}