using AutoMapper;
using Core.DTOs.SubscriptionsDTOs;
using Data.Entities.Subscription;

namespace Core.Mappers;

public class SubscriptionProfile : Profile
{
    public SubscriptionProfile()
    {
        CreateMap<SubscriptionEntity, SubscriptionDto>();

        CreateMap<SubscriptionCreateDto, SubscriptionEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(_ => true));

        CreateMap<SubscriptionUpdateDto, SubscriptionEntity>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.UserId, opt => opt.Ignore());
    }
}