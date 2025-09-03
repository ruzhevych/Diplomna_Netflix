using Core.DTOs.AdminDTOs;
using Core.Interfaces.Admin;
using Core.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/users")]
    //[Authorize(Policy = "RequireAdminRole")]
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

        [HttpPatch("block")]
        public async Task<IActionResult> BlockUser([FromBody] BlockUserDto dto)
        {
            await _service.BlockUserAsync(dto);
            return Ok(new { message = "User blocked successfully" });
        }

        [HttpPatch("unblock")]
        public async Task<IActionResult> UnblockUser(long userId, [FromQuery] long adminId)
        {
            await _service.UnblockUserAsync(userId, adminId);
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
}