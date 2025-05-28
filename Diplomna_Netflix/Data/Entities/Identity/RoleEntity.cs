using Data.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Data.Entities.Identity
{
    public class RoleEntity : IdentityRole<long>
    {
        public virtual ICollection<UserRoleEntity>? UserRoles { get; set; }
        public RoleEntity() : base() { }
        public RoleEntity(string roleName) : base(roleName) { }
    }
}
