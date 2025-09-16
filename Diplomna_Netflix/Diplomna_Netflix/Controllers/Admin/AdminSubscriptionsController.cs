using Core.DTOs.AdminDTOs.Subscriptions;
using Core.DTOs.SubscriptionsDTOs;
using Core.Interfaces.Admin;
using Core.Interfaces.Subscription;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Admin;

[Route("api/admin/subscriptions")]
[ApiController]
public class AdminSubscriptionsController : ControllerBase
{
    private readonly IAdminSubscriptionService _service;

    public AdminSubscriptionsController(IAdminSubscriptionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? type)
    {
        var result = await _service.GetAllAsync(search, type);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var sub = await _service.GetByIdAsync(id);
        if (sub == null) return NotFound();
        return Ok(sub);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] AdminSubscriptionCreateDto dto)
    {
        var result = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] AdminSubscriptionUpdateDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}