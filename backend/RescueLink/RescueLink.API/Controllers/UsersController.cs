using Microsoft.AspNetCore.Mvc;
using RescueLink.API.DTOs;
using RescueLink.API.Models;
using RescueLink.API.Repositories;

namespace RescueLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _repository;

        public UsersController(IUserRepository repository)
        {
            _repository = repository;
        }

        // GET /api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            var users = await _repository.GetAllAsync();
            var result = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            });

            return Ok(result);
        }

        // GET /api/users/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "User not found."
                });
            }

            var dto = new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };

            return Ok(dto);
        }

        // POST /api/users
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UserCreateUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse
                {
                    Error = "BadRequest",
                    Message = "Invalid user payload."
                });
            }

            var entity = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Role = dto.Role
            };

            var created = await _repository.CreateAsync(entity);

            var response = new UserResponseDto
            {
                Id = created.Id,
                Name = created.Name,
                Email = created.Email,
                Role = created.Role
            };

            return StatusCode(StatusCodes.Status201Created, response);
        }

        // PUT /api/users/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Replace(int id, [FromBody] UserCreateUpdateDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "User not found."
                });
            }

            existing.Name = dto.Name;
            existing.Email = dto.Email;
            existing.Role = dto.Role;

            var updated = await _repository.UpdateAsync(existing);

            var response = new UserResponseDto
            {
                Id = updated!.Id,
                Name = updated.Name,
                Email = updated.Email,
                Role = updated.Role
            };

            return Ok(response);
        }

        // PATCH /api/users/{id}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchRole(int id, [FromBody] UserPatchRoleDto dto)
        {
            var updated = await _repository.UpdateRoleAsync(id, dto.Role);
            if (updated == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "User not found."
                });
            }

            var response = new
            {
                id = updated.Id,
                role = updated.Role
            };

            return Ok(response);
        }

        // DELETE /api/users/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _repository.DeleteAsync(id);
            if (!ok)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "User not found."
                });
            }

            return NoContent();
        }
    }
}
