using System.Text;
using Core.Interfaces;
using Core.Mappers;
using Core.Options;
using Core.Repositories;
using Core.Services;
using Core.Validators.Authorization;
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

// Identity
builder.Services.AddIdentity<UserEntity, RoleEntity>()
    .AddEntityFrameworkStores<NetflixDbContext>()
    .AddDefaultTokenProviders();

// JWT Authentication
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("JwtOptions"));
builder.Services.AddScoped<JwtService>();

//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        var jwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>();
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = jwtOptions.Issuer,
//            ValidAudience = jwtOptions.Audience,
//            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey))
//        };
//    });


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


// Validations
builder.Services.AddControllers()
    .AddFluentValidation(fv =>
    {
        fv.RegisterValidatorsFromAssemblyContaining<RegisterDtoValidator>();
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // URL вашого фронтенду
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Controllers, Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerJWT();

var app = builder.Build();

// Middleware
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Diplomna_Netflix"));

app.UseAuthentication();
app.UseAuthorization();
app.UseCors("AllowFrontend");

app.MapControllers();

app.Run();
