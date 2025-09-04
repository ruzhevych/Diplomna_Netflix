using Data.Entities.Identity;

namespace Data.Entities.Favorites;

public class FavoriteEntity
{
    public long Id { get; set; }

    public long UserId { get; set; }
    public UserEntity User { get; set; } = null!;

    public string ContentId { get; set; } = null!; // id з TMDB
    public string ContentType { get; set; } = null!; // Movie, TV, Anime і т.д.

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}