using System.Security.Claims;
using Core.DTOs.CommentDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Comment;
[ApiController]
[Route("api/[controller]")]
//[Authorize]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentController(ICommentService commentService)
    {
        _commentService = commentService;
    }
    
    [HttpPost("add")]
    public async Task<IActionResult> AddComment([FromBody] CommentCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var comment = await _commentService.AddCommentAsync(userId, dto);
        return Ok(comment);
    }

    [HttpGet("movie/{movieId}")]
    public async Task<IActionResult> GetComments(int movieId)
    {
        var comments = await _commentService.GetCommentsForMovieAsync(movieId);
        return Ok(comments);
    }
    
    [HttpPut("update/{commentId}")]
    public async Task<IActionResult> UpdateComment(Guid commentId, [FromBody] string newContent)
    {
        var updated = await _commentService.UpdateCommentAsync(commentId, newContent);
        return Ok(updated);
    }

    [HttpDelete("delete/{commentId}")]
    public async Task<IActionResult> DeleteComment(Guid commentId)
    {
        var result = await _commentService.DeleteCommentAsync(commentId);
        return result ? Ok("Comment deleted") : NotFound("Comment not found");
    }

}