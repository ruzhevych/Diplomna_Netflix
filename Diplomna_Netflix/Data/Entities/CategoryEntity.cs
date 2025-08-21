

using System.ComponentModel.DataAnnotations;

public class CategoryEntity
{
    public int Id { get; set; }
    [Required]
    public int ExternalApiId { get; set; }
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    public int? ParentCategoryId { get; set; }
    public CategoryEntity? ParentCategory { get; set; }
    public ICollection<CategoryEntity> Subcategories { get; set; } = new List<CategoryEntity>();
    public ICollection<MediaItem> MediaItems { get; set; } = new List<MediaItem>();

}