using RescueLink.API.Models;

namespace RescueLink.API.Repositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User> CreateAsync(User user);
        Task<User?> UpdateAsync(User user);
        Task<User?> UpdateRoleAsync(int id, string role);
        Task<bool> DeleteAsync(int id);
    }
}
