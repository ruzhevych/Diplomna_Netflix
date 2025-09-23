using Core.DTOs.CardsDTOs;
using Core.Interfaces.Payment;
using Core.Interfaces.Repository;
using Data.Entities.Payment;
using Microsoft.EntityFrameworkCore;

namespace Core.Services.Payment;

public class PaymentService : IPaymentService
{
    private readonly IRepository<PaymentEntity> _paymentRepo;

    public PaymentService(IRepository<PaymentEntity> paymentRepo)
    {
        _paymentRepo = paymentRepo;
    }

    public async Task<CardDto> AddCardAsync(long userId, CardCreateDto dto)
    {
        var cleanPan = new string(dto.CardNumber.Where(char.IsDigit).ToArray());
        var last4 = cleanPan.Length >= 4 ? cleanPan[^4..] : cleanPan;
        var brand = DetectCardBrand(cleanPan);
        var token = "tok_" + Guid.NewGuid().ToString("N");

        if (dto.MakeDefault)
        {
            var existing = await _paymentRepo.GetAllAsync(c => c.UserId == userId && c.IsDefault);
            foreach (var c in existing)
                c.IsDefault = false;
            _paymentRepo.UpdateRange(existing);
        }

        var card = new PaymentEntity
        {
            UserId = userId,
            Token = token,
            Last4 = last4,
            Brand = brand,
            ExpMonth = dto.ExpMonth,
            ExpYear = dto.ExpYear,
            CardholderName = dto.CardholderName,
            IsDefault = true,
        };

        await _paymentRepo.AddAsync(card);
        await _paymentRepo.SaveChangesAsync();

        return ToDto(card);
    }

    public async Task<List<CardDto>> GetUserCardsAsync(long userId)
    {
        var cards = await _paymentRepo.GetAllAsync(c => c.UserId == userId);
        return cards.Select(ToDto).ToList();
    }

    public async Task<CardDto> UpdateCardAsync(long userId, long cardId, CardUpdateDto dto)
    {
        var card = await _paymentRepo.GetAllQueryable()
            .FirstOrDefaultAsync(c => c.Id == cardId && c.UserId == userId);

        if (card == null)
            throw new KeyNotFoundException("Card not found");
        
        var cleanPan = new string(dto.CardNumber.Where(char.IsDigit).ToArray());
        var last4 = cleanPan.Length >= 4 ? cleanPan[^4..] : cleanPan;
        var brand = DetectCardBrand(cleanPan);

        card.Last4 = last4;
        card.Brand = brand;
        card.CardholderName = dto.CardholderName;
        card.ExpMonth = dto.ExpMonth.Value;
        card.ExpYear = dto.ExpYear.Value;
        card.IsDefault = true;

        if (dto.MakeDefault.HasValue && dto.MakeDefault.Value)
        {
            var existing = await _paymentRepo.GetAllAsync(c => c.UserId == userId && c.IsDefault && c.Id != card.Id);
            foreach (var c in existing)
                c.IsDefault = false;
            _paymentRepo.UpdateRange(existing);

            card.IsDefault = true;
        }

        _paymentRepo.Update(card);
        await _paymentRepo.SaveChangesAsync();

        return ToDto(card);
    }

    public async Task DeleteCardAsync(long userId, long cardId)
    {
        var card = await _paymentRepo.GetAllQueryable()
            .FirstOrDefaultAsync(c => c.Id == cardId && c.UserId == userId);

        if (card == null)
            throw new KeyNotFoundException("Card not found");

        var wasDefault = card.IsDefault;

        _paymentRepo.Delete(card);
        await _paymentRepo.SaveChangesAsync();

        if (wasDefault)
        {
            var other = await _paymentRepo.GetAllQueryable()
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.CreatedAt)
                .FirstOrDefaultAsync();

            if (other != null)
            {
                other.IsDefault = true;
                _paymentRepo.Update(other);
                await _paymentRepo.SaveChangesAsync();
            }
        }
    }

    private static CardDto ToDto(PaymentEntity c) => new()
    {
        Id = c.Id,
        Token = c.Token,
        Last4 = c.Last4,
        Brand = c.Brand,
        ExpMonth = c.ExpMonth,
        ExpYear = c.ExpYear,
        CardholderName = c.CardholderName,
        IsDefault = c.IsDefault
    };

    private string DetectCardBrand(string pan)
    {
        if (string.IsNullOrEmpty(pan)) return "Unknown";
        if (pan.StartsWith("4")) return "Visa";
        if (pan.StartsWith("5")) return "MasterCard";
        if (pan.StartsWith("34") || pan.StartsWith("37")) return "Amex";
        return "Unknown";
    }
}
