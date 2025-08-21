

public abstract class MediaItem
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Description { get; set; }
    public DateTime ReleaseDate { get; set; }
    public int MediaTypeId { get; set; }
     public ICollection<CategoryEntity> Categories { get; set; } = new List<CategoryEntity>();



}