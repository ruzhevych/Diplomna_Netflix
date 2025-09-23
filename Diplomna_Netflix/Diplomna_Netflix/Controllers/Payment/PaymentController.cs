using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Core.DTOs.CardsDTOs;
using Core.Interfaces.Payment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diplomna_Netflix.Controllers.Payment;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    private long GetUserId()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                    User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return long.Parse(idStr!);
    }

    [HttpPost]
    public async Task<ActionResult<CardDto>> AddCard([FromBody] CardCreateDto dto)
    {
        var userId = GetUserId();
        var card = await _paymentService.AddCardAsync(userId, dto);
        return Ok(card);
    }

    [HttpGet]
    public async Task<ActionResult<List<CardDto>>> GetMyCards()
    {
        var userId = GetUserId();
        var cards = await _paymentService.GetUserCardsAsync(userId);
        return Ok(cards);
    }
    
    [HttpPut("{id}")]
    public async Task<ActionResult<CardDto>> UpdateCard(long id, [FromBody] CardUpdateDto dto)
    {
        var userId = GetUserId();
        var card = await _paymentService.UpdateCardAsync(userId, id, dto);
        return Ok(card);
    }
    
    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteCard(long id)
    {
        var userId = GetUserId();
        await _paymentService.DeleteCardAsync(userId, id);
        return NoContent();
    }

}
