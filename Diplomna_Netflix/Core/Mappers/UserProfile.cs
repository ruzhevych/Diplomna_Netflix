using AutoMapper;
using Core.DTOs.UsersDTOs;
using Data.Entities;

namespace Core.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserCreateDTO, UserEntity>();
            CreateMap<UserUpdateDTO, UserEntity>().ForMember(dest => dest.UserName, opt => opt.Ignore());
            CreateMap<UserEntity, UserDTO>();
        }
    }
}