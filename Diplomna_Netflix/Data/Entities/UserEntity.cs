namespace Data.Entities
{
    public class UserEntity
    {
        public long Id { get; set; }
        public string? FullName { get; set; } = null!;
        public string? Email { get; set; } = null!;
        public string? UserName { get; set; } = null!;
        public string? PasswordHash { get; set; } = null!;
    }
}