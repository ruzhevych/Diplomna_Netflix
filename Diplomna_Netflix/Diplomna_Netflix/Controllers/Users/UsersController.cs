using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Data.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Diplomna_Netflix.Controllers.Users
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromForm] UserUpdateDto dto)
        {
            dto.Id = id; // ïðîáðîñèìî id ç ðîóòà â DTO
            await _userService.UpdateUserAsync(dto);
            return Ok();
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            await _userService.DeleteUserAsync(id);
            return Ok();
        }

        [HttpGet("email/{email}")]
        public async Task<ActionResult<UserDto?>> GetByEmail(string email)
        {
            var user = await _userService.GetByEmailAsync(email);
            return user == null ? NotFound() : Ok(user);
        }

        //[Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null) return Unauthorized();

            var user = await _userService.GetByIdAsync(userId);
            if (user == null) return NotFound();

            // Get active ban
            using (var scope = HttpContext.RequestServices.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<NetflixDbContext>();
                var activeBan = await db.AdminBans.FirstOrDefaultAsync(b => b.UserId.ToString() == userId && b.IsActive);
                if (activeBan != null)
                {
                    return StatusCode(403, new
                    {
                        message = "UserBlocked",
                        reason = activeBan.Reason,
                        unblockDate = activeBan.EndDate
                    });
                }
            }

            return Ok(user);
        }
    }
}