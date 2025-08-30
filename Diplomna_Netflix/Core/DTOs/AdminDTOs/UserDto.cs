namespace Core.DTOs.AdminDTOs
{
    public class UserDto
    {
        public long Id { get; set; }
        public string Email { get; set; } = null!;
        public string FullName { get; set; } = "";
        public string Role { get; set; } = null!;
        public bool IsBlocked { get; set; }
    }
}