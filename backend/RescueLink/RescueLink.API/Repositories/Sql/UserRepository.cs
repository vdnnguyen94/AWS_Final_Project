using Microsoft.EntityFrameworkCore;
using RescueLink.API.Data;
using RescueLink.API.Models;

namespace RescueLink.API.Repositories.Sql
{
    public class UserRepository : IUserRepository
    {
        private readonly RescueLinkDbContext _db;

        public UserRepository(RescueLinkDbContext db)
        {
            _db = db;
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _db.Users.AsNoTracking().ToListAsync();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _db.Users.FindAsync(id);
        }

        public async Task<User> CreateAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateAsync(User user)
        {
            if (!await _db.Users.AnyAsync(u => u.Id == user.Id))
            {
                return null;
            }

            _db.Users.Update(user);
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateRoleAsync(int id, string role)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            user.Role = role;
            await _db.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null)
            {
                return false;
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
