using Core.Models.Authentication;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class RefreshTokenRequestDtoValidator : AbstractValidator<RefreshTokenRequest>
    {
        public RefreshTokenRequestDtoValidator()
        {
            RuleFor(x => x.RefreshToken).NotEmpty();
        }
    }
}