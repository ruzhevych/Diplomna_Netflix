using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Core.DTOs.SubscriptionsDTOs;
using Core.Interfaces.Subscription;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Subscription;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubscriptionController : ControllerBase
{
    private readonly ISubscriptionService _service;

    public SubscriptionController(ISubscriptionService service)
    {
        _service = service;
    }

    [HttpGet("my")]
    public async Task<IActionResult> Get()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var result = await _service.GetByIdAsync(userId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SubscriptionUpdateDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        return success ? NoContent() : NotFound();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var success = await _service.DeleteAsync(userId);
        return success ? NoContent() : NotFound();
    }
}