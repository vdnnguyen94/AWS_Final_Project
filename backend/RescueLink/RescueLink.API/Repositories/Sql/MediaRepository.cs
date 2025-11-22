using Microsoft.EntityFrameworkCore;
using RescueLink.API.Data;
using RescueLink.API.Models;

namespace RescueLink.API.Repositories.Sql
{
    public class MediaRepository : IMediaRepository
    {
        private readonly RescueLinkDbContext _db;

        public MediaRepository(RescueLinkDbContext db)
        {
            _db = db;
        }

        public async Task<List<MediaItem>> GetAllAsync()
        {
            return await _db.Media.AsNoTracking().ToListAsync();
        }

        public async Task<MediaItem?> GetByIdAsync(int id)
        {
            return await _db.Media.FindAsync(id);
        }

        public async Task<MediaItem> CreateAsync(MediaItem media)
        {
            _db.Media.Add(media);
            await _db.SaveChangesAsync();
            return media;
        }

        public async Task<MediaItem?> UpdateAsync(MediaItem media)
        {
            if (!await _db.Media.AnyAsync(m => m.Id == media.Id))
            {
                return null;
            }

            _db.Media.Update(media);
            await _db.SaveChangesAsync();
            return media;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var media = await _db.Media.FindAsync(id);
            if (media == null)
            {
                return false;
            }

            _db.Media.Remove(media);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
