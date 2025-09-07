using System.Text;
using Core.Mappers;
using Core.Options;
using Core.Repositories;
using Core.Interfaces.Admin;
using Core.Interfaces.Auth;
using Core.Interfaces.Category;
using Core.Interfaces.Comments;
using Core.Interfaces.Cookies;
using Core.Interfaces.Email;
using Core.Interfaces.Favorites;
using Core.Interfaces.ForLater;
using Core.Interfaces.History;
using Core.Interfaces.Repository;
using Core.Interfaces.Subscription;
using Core.Interfaces.User;
using Core.Services.Admin;
using Core.Services.Auth;
using Core.Services.Category;
using Core.Services.Comments;
using Core.Services.Email;
using Core.Services.Favorites;
using Core.Services.ForLater;
using Core.Services.History;
using Core.Services.Subscription;
using Core.Services.User;
using Core.Validators.Authorization;
using Core.Validators.Subscriptions;
using Data.Context;
using Data.Entities.Identity;
using Diplomna_Netflix.ServiceExtensions;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Load JwtOptions from configuration
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName)
);
var jwtOptions = builder.Configuration
    .GetSection(JwtOptions.SectionName)
    .Get<JwtOptions>();

// Add DbContext
builder.Services.AddDbContext<NetflixDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<DbContext, NetflixDbContext>();

// Repositories, Services, Mappers
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddAutoMapper(typeof(UserProfile));
builder.Services.AddAutoMapper(typeof(AuthProfile));
builder.Services.AddScoped<ISubscriptionService, SubscriptionService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<IAdminUserService, AdminUserService>();
builder.Services.AddScoped<IFavoriteService, FavoriteService>();
builder.Services.AddScoped<IForLaterService, ForLaterService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICookieService, CookieService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IMovieHistoryService, MovieHistoryService>();
builder.Services.AddScoped<IAdminSubscriptionService, AdminSubscriptionService>();

// Identity
builder.Services.AddIdentity<UserEntity, RoleEntity>()
    .AddEntityFrameworkStores<NetflixDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("JwtOptions"));
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    //var jwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>();
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("qz+vXe9TZhM1EC2y+N6qMu7hfWqupZ0EjyiRZX+51zA="))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireRole("Admin"));
});



// Validations
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<RegisterDtoValidator>();
        fv.RegisterValidatorsFromAssemblyContaining<SubscriptionCreateValidator>();
        
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // URL фронтенду
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
// Controllers, Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerJWT();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var seeder = new DataSeeder(scope.ServiceProvider, builder.Configuration);
    await seeder.SeedAsync();
}

// Middleware
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Diplomna_Netflix"));

app.UseStaticFiles();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
