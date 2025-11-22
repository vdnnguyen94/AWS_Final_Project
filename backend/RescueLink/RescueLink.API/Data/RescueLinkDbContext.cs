using Microsoft.EntityFrameworkCore;
using RescueLink.API.Models;

namespace RescueLink.API.Data
{
    public class RescueLinkDbContext : DbContext
    {
        public RescueLinkDbContext(DbContextOptions<RescueLinkDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Incident> Incidents => Set<Incident>();
        public DbSet<MediaItem> Media => Set<MediaItem>();
    }
}
