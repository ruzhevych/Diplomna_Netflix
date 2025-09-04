using Core.DTOs.FavoritesDTOs;
using Core.Services.Favorites;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly FavoriteService _favoriteService;

    public FavoritesController(FavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] FavoriteCreateDto dto)

    {
        if (dto == null)
            return BadRequest("DTO is null");
        var result = await _favoriteService.AddAsync(dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserFavorites()
    {
        var result = await _favoriteService.GetUserFavoritesAsync();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Remove(long id)
    {
        await _favoriteService.RemoveAsync(id);
        return NoContent();
    }
}