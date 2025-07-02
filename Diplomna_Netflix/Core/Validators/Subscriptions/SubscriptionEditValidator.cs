using Core.DTOs.SubscriptionsDTOs;
using FluentValidation;

namespace Core.Validators.Subscriptions
{
    public class SubscriptionEditValidator : AbstractValidator<SubscriptionUpdateDto>
    {
        public SubscriptionEditValidator()
        {
            RuleFor(x => x.Type)
                .NotEmpty()
                .MaximumLength(20)
                .WithMessage("Тип підписки обов'язковий і максимум 20 символів.")
                .Must(t => t == "Basic" || t == "Standard" || t == "Premium")
                .WithMessage("Тип має бути: Basic, Standard або Premium.");

            RuleFor(x => x.StartDate)
                .LessThan(x => x.EndDate)
                .WithMessage("Дата початку має бути меншою за дату завершення.");
        }
    }
}