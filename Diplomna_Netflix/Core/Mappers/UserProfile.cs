using AutoMapper;
using Core.DTOs.AdminDTOs.Users;
using Core.DTOs.UsersDTOs;
using Data.Entities;
using Data.Entities.Admin;
using Data.Entities.Identity;
using BlockedUserDto = Core.DTOs.AdminDTOs.Users.BlockedUserDto;
using UserDto = Core.DTOs.UsersDTOs.UserDto;

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
        
        CreateMap<UserBlockHistoryEntity, BlockedUserDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
            .ForMember(dest => dest.BlockedAt, opt => opt.MapFrom(src => src.BlockedAt))
            .ForMember(dest => dest.DurationDays, opt => opt.MapFrom(src => 
                src.Duration.HasValue ? (int)src.Duration.Value.TotalDays : 0))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason));

    }
}