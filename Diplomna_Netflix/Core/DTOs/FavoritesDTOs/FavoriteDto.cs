namespace Core.DTOs.FavoritesDTOs
{
    public class FavoriteDto
    {
        public long Id { get; set; }
        public string ContentId { get; set; } = null!;
        public string ContentType { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }
}