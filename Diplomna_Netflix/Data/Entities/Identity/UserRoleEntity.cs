using Microsoft.AspNetCore.Identity;

namespace Data.Entities.Identity;

public class UserRoleEntity : IdentityUserRole<long>
{
    public UserEntity User { get; set; }
    public RoleEntity Role { get; set; }
}