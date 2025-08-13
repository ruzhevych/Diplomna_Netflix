using Core.Models.Authentication;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class GoogleLoginDtoValidator : AbstractValidator<GoogleLogin>
    {
        public GoogleLoginDtoValidator()
        {
            RuleFor(x => x.GoogleAccessToken).NotEmpty();
        }
    }
}