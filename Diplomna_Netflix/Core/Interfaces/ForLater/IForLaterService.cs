using Core.DTOs.ForLaterDTOs;

namespace Core.Interfaces.ForLater;

public interface IForLaterService
{
    Task<ForLaterDto> AddAsync(ForLaterCreateDto dto);
    Task<IEnumerable<ForLaterDto>> GetUserForLaterAsync();
    Task RemoveAsync(long id);
}