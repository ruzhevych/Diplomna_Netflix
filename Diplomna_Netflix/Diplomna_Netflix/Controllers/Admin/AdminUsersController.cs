using Core.DTOs.Admin;
using Core.Interfaces.Admin;
using Core.Services.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Admin
{
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

        [HttpPatch("{id}/block")]
        public async Task<IActionResult> BlockUser(long id)
        {
            await _service.BlockUserAsync(id);
            return NoContent();
        }

        [HttpPatch("{id}/unblock")]
        public async Task<IActionResult> UnblockUser(long id)
        {
            await _service.UnblockUserAsync(id);
            return NoContent();
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