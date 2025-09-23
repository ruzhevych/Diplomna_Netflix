using Core.DTOs.CardsDTOs;

namespace Core.Interfaces.Payment;

public interface IPaymentService
{
    Task<CardDto> AddCardAsync(long userId, CardCreateDto dto);
    Task<List<CardDto>> GetUserCardsAsync(long userId);
    Task<CardDto> UpdateCardAsync(long userId, long cardId, CardUpdateDto dto);
    Task DeleteCardAsync(long userId, long cardId);
}
