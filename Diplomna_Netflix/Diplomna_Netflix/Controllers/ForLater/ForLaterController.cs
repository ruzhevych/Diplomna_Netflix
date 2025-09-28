using Core.DTOs.FavoritesDTOs;
using Core.DTOs.ForLaterDTOs;
using Core.Interfaces.Favorites;
using Core.Interfaces.ForLater;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.ForLater;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ForLaterController : ControllerBase
{
    private readonly IForLaterService _forLaterService;

    public ForLaterController(IForLaterService forLaterService)
    {
        _forLaterService = forLaterService;
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] ForLaterCreateDto dto)

    {
        try
        {
            if (dto == null)
                return BadRequest("DTO is null");
            var result = await _forLaterService.AddAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetUserForLater()
    {
        var result = await _forLaterService.GetUserForLaterAsync();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(long id)
    {
        await _forLaterService.RemoveAsync(id);
        return NoContent();
    }
}