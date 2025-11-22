using RescueLink.API.Models;

namespace RescueLink.API.Repositories
{
    public interface IIncidentRepository
    {
        Task<List<Incident>> GetAllAsync();
        Task<Incident?> GetByIdAsync(int id);
        Task<Incident> CreateAsync(Incident incident);
        Task<Incident?> UpdateAsync(Incident incident);
        Task<Incident?> UpdateStatusAsync(int id, string status);
        Task<bool> DeleteAsync(int id);
    }
}
