using AutoMapper;
using Core.DTOs.AdminDTOs.Users;
using Data.Entities.Admin;
using Data.Entities.Identity;

namespace Core.Mappers;

public class AdminUsersProfile : Profile
{
    public AdminUsersProfile()
    {
        CreateMap<UserEntity, UserDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.FullName,
                opt => opt.MapFrom(src =>
                    !string.IsNullOrWhiteSpace(src.FullName)
                        ? src.FullName
                        : $"{src.FirstName} {src.LastName}".Trim()))
            .ForMember(dest => dest.Role,
                opt => opt.MapFrom(src =>
                    src.UserRoles.Any()
                        ? src.UserRoles.First().Role.Name
                        : string.Empty))
            .ForMember(dest => dest.IsBlocked, opt => opt.MapFrom(src => src.IsBlocked));
        
        CreateMap<UserBlockHistoryEntity, BlockedUserDto>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.AdminId, opt => opt.MapFrom(src => src.AdminId))
            .ForMember(dest => dest.BlockedAt, opt => opt.MapFrom(src => src.BlockedAt))
            .ForMember(dest => dest.DurationDays, opt => opt.MapFrom(src => 
                src.Duration.HasValue ? (int)src.Duration.Value.TotalDays : 0))
            .ForMember(dest => dest.Reason, opt => opt.MapFrom(src => src.Reason));
    }
}