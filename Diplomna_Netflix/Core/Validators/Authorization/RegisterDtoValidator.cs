using Core.DTOs.AuthorizationDTOs;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email обовʼязковий")
                .EmailAddress().WithMessage("Невірний формат email");

            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Імʼя користувача обовʼязкове")
                .MinimumLength(3).WithMessage("Мінімум 3 символи");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Пароль обовʼязковий")
                .MinimumLength(6).WithMessage("Мінімум 6 символів")
                .Matches(@"[A-Z]").WithMessage("Має містити хоча б одну велику літеру")
                .Matches(@"[a-z]").WithMessage("Має містити хоча б одну малу літеру")
                .Matches(@"\d").WithMessage("Має містити хоча б одну цифру");
        }
    }
}