using AutoMapper;
using Core.Options;
using Data.Entities.Identity;

namespace Core.Mappers;

public class AuthProfile : Profile
{
    public AuthProfile()
    {
        CreateMap<GoogleUserInfo, UserEntity>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Sub))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.GivenName))
            .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.FamilyName))
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.Picture));
    }
}