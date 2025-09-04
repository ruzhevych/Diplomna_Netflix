using Core.DTOs.AuthorizationDTOs;
using FluentValidation;

namespace Core.Validators.Authorization;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email обовʼязковий")
            .EmailAddress().WithMessage("Невірний формат email");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль обовʼязковий");
    }
}