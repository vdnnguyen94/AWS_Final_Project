using Microsoft.EntityFrameworkCore;
using RescueLink.API.Data;
using RescueLink.API.Models;

namespace RescueLink.API.Repositories.Sql
{
    public class IncidentRepository : IIncidentRepository
    {
        private readonly RescueLinkDbContext _db;

        public IncidentRepository(RescueLinkDbContext db)
        {
            _db = db;
        }

        public async Task<List<Incident>> GetAllAsync()
        {
            return await _db.Incidents.AsNoTracking().ToListAsync();
        }

        public async Task<Incident?> GetByIdAsync(int id)
        {
            return await _db.Incidents.FindAsync(id);
        }

        public async Task<Incident> CreateAsync(Incident incident)
        {
            _db.Incidents.Add(incident);
            await _db.SaveChangesAsync();
            return incident;
        }

        public async Task<Incident?> UpdateAsync(Incident incident)
        {
            if (!await _db.Incidents.AnyAsync(i => i.Id == incident.Id))
            {
                return null;
            }

            _db.Incidents.Update(incident);
            await _db.SaveChangesAsync();
            return incident;
        }

        public async Task<Incident?> UpdateStatusAsync(int id, string status)
        {
            var incident = await _db.Incidents.FindAsync(id);
            if (incident == null)
            {
                return null;
            }

            incident.Status = status;
            await _db.SaveChangesAsync();
            return incident;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var incident = await _db.Incidents.FindAsync(id);
            if (incident == null)
            {
                return false;
            }

            _db.Incidents.Remove(incident);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
