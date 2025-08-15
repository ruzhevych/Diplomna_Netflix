using Microsoft.AspNetCore.Identity;
using Data.Entities.Identity;

namespace Diplomna_Netflix.ServiceExtensions;

public class DataSeeder
{
    private readonly IServiceProvider _serviceProvider;
    private readonly IConfiguration _configuration;

    public DataSeeder(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        _serviceProvider = serviceProvider;
        _configuration = configuration;
    }

    public async Task SeedAsync()
    {
        using var scope = _serviceProvider.CreateScope();
        var sp = scope.ServiceProvider;

        await SeedRolesAndAdminAsync(sp);
    }

    #region Roles & Admin
    private static async Task SeedRolesAndAdminAsync(IServiceProvider sp)
    {
        var roleManager = sp.GetRequiredService<RoleManager<RoleEntity>>();
        var userManager = sp.GetRequiredService<UserManager<UserEntity>>();

        // Створюємо ролі
        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new RoleEntity { Name = "Admin" });

        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new RoleEntity { Name = "User" });

        // Створюємо дефолтного адміна
        var adminEmail = "admin@netflix.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new UserEntity
            {
                UserName = "admin",
                Email = adminEmail,
                FirstName = "System",
                LastName = "Admin",
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(adminUser, "Admin123!");

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
    #endregion
}