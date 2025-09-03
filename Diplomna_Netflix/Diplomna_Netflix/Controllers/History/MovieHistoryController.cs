using System.Security.Claims;
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
    
    [HttpPost("add/{movieId}")]
    public async Task<IActionResult> AddToHistory(int movieId, string mediaType)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _historyService.AddToHistoryAsync(movieId, mediaType);
        return Ok();
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyHistory()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var history = await _historyService.GetUserHistoryAsync(userId);
        return Ok(history);
    }
    
    [HttpDelete("delete/{movieId}")]
    public async Task<IActionResult> DeleteFromHistory(int movieId)
    {
        var result = await _historyService.DeleteFromHistoryAsync(movieId);
        return result ? Ok("Entry removed from history") : NotFound("Entry not found");
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearHistory()
    {
        var count = await _historyService.ClearHistoryAsync();
        return Ok($"{count} items deleted from history");
    }

}