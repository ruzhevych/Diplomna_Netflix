using System.Security.Claims;
using Core.DTOs.ContentDTOs;
using Core.Interfaces.History;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.History;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MovieHistoryController : ControllerBase
{
    private readonly IMovieHistoryService _historyService;

    public MovieHistoryController(IMovieHistoryService historyService)
    {
        _historyService = historyService;
    }
    
    [HttpPost("add")]
    public async Task<IActionResult> AddToHistory(MediaItemDto mediaItemDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _historyService.AddToHistoryAsync(mediaItemDto);
        return Ok();
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var history = await _historyService.GetUserHistoryAsync(userId);
        return Ok(history);
    }
    
    [HttpDelete("delete/{Id}")]
    public async Task<IActionResult> DeleteFromHistory(int id)
    {
        var result = await _historyService.DeleteFromHistoryAsync(id);
        if (!result)
            return NotFound(new { success = false, message = "Entry not found" });

        return Ok(new { success = true, message = "Entry removed from history" });
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearHistory()
    {
        var count = await _historyService.ClearHistoryAsync();
        return Ok(new { success = true, deleted = count, message = $"{count} items deleted from history" });
    }

}