using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
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

        await SeedRoles(sp);
    }

    #region Roles
    private static async Task SeedRoles(IServiceProvider sp)
    {
        var roleManager = sp.GetRequiredService<RoleManager<RoleEntity>>();

        if (!await roleManager.RoleExistsAsync("Admin"))
            await roleManager.CreateAsync(new RoleEntity { Name = "Admin" });

        if (!await roleManager.RoleExistsAsync("User"))
            await roleManager.CreateAsync(new RoleEntity { Name = "User" });
    }
    #endregion
}