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

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] SubscriptionCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        
        if (!long.TryParse(userId, out var parsedUserId))
            return BadRequest("Invalid userId");
        
        var result = await _service.CreateAsync(dto, parsedUserId);
        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMy()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                     User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        if (!long.TryParse(userId, out var parsedUserId))
            return BadRequest("Invalid userId");

        var result = await _service.GetByUserIdAsync(parsedUserId);
        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SubscriptionUpdateDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        return success ? NoContent() : NotFound();
    }


    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? NoContent() : NotFound();
    }

}