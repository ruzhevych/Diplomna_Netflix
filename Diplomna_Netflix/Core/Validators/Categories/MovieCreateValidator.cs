

using FluentValidation;

public class MovieCreateValidator : AbstractValidator<MovieCreateDto>
{
    private static readonly string[] AllowedCategories =
    {
        "Movie", "Cartoon", "Anime", "Series"
    };
    private bool BeValidCategory(string category)
    {
        return AllowedCategories.Contains(category.ToLowerInvariant());
    }

    public MovieCreateValidator()
    {
        RuleFor(x => x.Title)
        .NotEmpty().WithMessage("Title is required");

        RuleFor(x => x.Description)
        .NotEmpty().WithMessage("Description is required");

        RuleFor(x => x.Year)
        .NotEmpty().WithMessage("Year is required")
        .LessThanOrEqualTo(DateTime.UtcNow.Year + 1);

        RuleFor(x => x.Genre)
        .NotEmpty().WithMessage("Genre is required");

        RuleFor(x => x.Category)
        .NotEmpty().WithMessage("Category is required")
        .Must(BeValidCategory)
        .WithMessage("Allowed categories: Movie, Cartoon, Anime, Series");







    }
}
