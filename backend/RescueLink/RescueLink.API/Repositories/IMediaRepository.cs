using RescueLink.API.Models;

namespace RescueLink.API.Repositories
{
    public interface IMediaRepository
    {
        Task<List<MediaItem>> GetAllAsync();
        Task<MediaItem?> GetByIdAsync(int id);
        Task<MediaItem> CreateAsync(MediaItem media);
        Task<MediaItem?> UpdateAsync(MediaItem media);
        Task<bool> DeleteAsync(int id);
    }
}
