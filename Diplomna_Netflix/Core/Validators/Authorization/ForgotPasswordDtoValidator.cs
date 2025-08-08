using Core.DTOs.AuthorizationDTOs;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class ForgotPasswordDtoValidator : AbstractValidator<ForgotPasswordDto>
    {
        public ForgotPasswordDtoValidator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
        }
    }

}