using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        // [HttpGet]
        // public async Task<ActionResult<List<UserDto>>> GetAll() =>
        //     Ok(await _userService.GetAllAsync());

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(string id)
        {
            var user = await _userService.GetByIdAsync(id);
            return user == null ? NotFound() : Ok(user);
        }

        // [HttpPost]
        // public async Task<IActionResult> Create(UserCreateDto dto)
        // {
        //     await _userService.CreateUserAsync(dto);
        //     return Ok();
        // }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update([FromForm] UserUpdateDto dto)
        {
            await _userService.UpdateUserAsync(dto);
            return Ok();
        }

        [HttpDelete("{id}")]
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
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                         User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (userId == null) return Unauthorized();

            var user = await _userService.GetByIdAsync(userId);
            return Ok(user);

        }
    }
}