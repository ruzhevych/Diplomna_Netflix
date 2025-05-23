namespace Core.DTOs.UsersDTOs
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}