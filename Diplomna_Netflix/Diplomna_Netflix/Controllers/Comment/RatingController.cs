using System.Security.Claims;
using Core.DTOs.CommentDTOs;
using Core.Interfaces.Comments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Comment;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RatingController : ControllerBase
{
    private readonly IRatingService _ratingService;

    public RatingController(IRatingService ratingService)
    {
        _ratingService = ratingService;
    }

    [HttpPost("add-or-update")]
    public async Task<IActionResult> AddOrUpdateRating([FromBody] RatingCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var rating = await _ratingService.AddOrUpdateRatingAsync(userId, dto);
        return Ok(rating);
    }

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetRatings(int movieId, string movieType)
    {
        var ratings = await _ratingService.GetRatingsForMovieAsync(movieId, movieType);
        return Ok(ratings);
    }

    [HttpGet("movie/{movieId}/average")]
    public async Task<IActionResult> GetAverageRating(int movieId, string movieType)
    {
        var avg = await _ratingService.GetAverageRatingForMovieAsync(movieId, movieType);
        return Ok(avg ?? 0);
    }

    [HttpGet("movie/{movieId}/user")]
    public async Task<IActionResult> GetUserRating(int movieId, string movieType)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var rating = await _ratingService.GetUserRatingForMovieAsync(movieId, userId, movieType);
        return Ok(rating);
    }
}