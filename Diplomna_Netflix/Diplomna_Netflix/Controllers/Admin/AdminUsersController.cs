using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Core.DTOs.AdminDTOs.Users;
using Core.Interfaces.Admin;
using Core.Interfaces.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Admin;

[ApiController]
[Route("api/admin/users")]
[Authorize(Policy = "RequireAdminRole")]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _service;

    public AdminUsersController(IAdminUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers(int page = 1, int pageSize = 10, string? search = null)
    {
        return Ok(await _service.GetUsersAsync(page, pageSize, search));
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserById(string id)
    {
        var user = await _service.GetByIdAsync(id);
        return Ok(user);
    }
    
    [HttpGet("blocked")]
    public async Task<ActionResult> GetBlockedUsers(int page = 1, int pageSize = 10, string? search = null)
    {
        var result = await _service.GetBlockedUsersAsync(page, pageSize, search);
        return Ok(result);
    }
    
    [HttpGet("{id}/blocked")]
    public async Task<IActionResult> GetBlockUser(long id)
    {
        var blockUser = await _service.GetBlockedUserAsync(id);
        return Ok(blockUser);
    }

    [HttpPatch("block")]
    public async Task<IActionResult> BlockUser([FromBody] BlockUserDto dto)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (adminId == null) return Unauthorized();

        var admin = await _service.GetByIdAsync(adminId);
        await _service.BlockUserAsync(dto, admin.Id);
        return Ok(new { message = "User blocked successfully" });
    }

    [HttpPatch("unblock")]
    public async Task<IActionResult> UnblockUser(long userId)
    {
        var adminId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                      User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (adminId == null) return Unauthorized();

        var admin = await _service.GetByIdAsync(adminId);
        await _service.UnblockUserAsync(userId, admin.Id);
        return Ok(new { message = "User unblocked successfully" });
    }

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> ChangeRole(long id, [FromQuery] string role)
    {
        await _service.ChangeUserRoleAsync(id, role);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(long id)
    {
        await _service.DeleteUserAsync(id);
        return NoContent();
    }

    [HttpPost("send-message")]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
    {
        await _service.SendMessageAsync(dto);
        return Ok(new { message = "Message sent successfully!" });
    }
}