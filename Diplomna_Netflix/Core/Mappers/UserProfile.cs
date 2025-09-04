using AutoMapper;
using Core.DTOs.UsersDTOs;
using Data.Entities;
using Data.Entities.Identity;

namespace Core.Mappers;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserCreateDto, UserEntity>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<UserUpdateDto, UserEntity>()
            .ForMember(dest => dest.UserName, opt => opt.Ignore()) // залишаємо як є
            .ForMember(dest => dest.EmailConfirmed, opt => opt.Ignore());

        CreateMap<UserEntity, UserDto>();
    }
}