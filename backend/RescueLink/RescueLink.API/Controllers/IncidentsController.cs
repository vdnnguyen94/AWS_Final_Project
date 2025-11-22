using Microsoft.AspNetCore.Mvc;
using RescueLink.API.DTOs;
using RescueLink.API.Models;
using RescueLink.API.Repositories;

namespace RescueLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidentsController : ControllerBase
    {
        private readonly IIncidentRepository _repository;

        public IncidentsController(IIncidentRepository repository)
        {
            _repository = repository;
        }

        // GET /api/incidents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<IncidentResponseDto>>> GetAll()
        {
            var incidents = await _repository.GetAllAsync();
            var result = incidents.Select(i => new IncidentResponseDto
            {
                Id = i.Id,
                Title = i.Title,
                Description = i.Description,
                Latitude = i.Latitude,
                Longitude = i.Longitude,
                Status = i.Status,
                CreatedAt = i.CreatedAt
            });

            return Ok(result);
        }

        // GET /api/incidents/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var incident = await _repository.GetByIdAsync(id);
            if (incident == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Incident not found."
                });
            }

            var dto = new IncidentResponseDto
            {
                Id = incident.Id,
                Title = incident.Title,
                Description = incident.Description,
                Latitude = incident.Latitude,
                Longitude = incident.Longitude,
                Status = incident.Status,
                CreatedAt = incident.CreatedAt
            };

            return Ok(dto);
        }

        // POST /api/incidents
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IncidentCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ErrorResponse
                {
                    Error = "BadRequest",
                    Message = "Invalid incident payload."
                });
            }

            var entity = new Incident
            {
                Title = dto.Title,
                Description = dto.Description,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Status = "Open",
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(entity);

            var response = new IncidentResponseDto
            {
                Id = created.Id,
                Title = created.Title,
                Description = created.Description,
                Latitude = created.Latitude,
                Longitude = created.Longitude,
                Status = created.Status,
                CreatedAt = created.CreatedAt
            };

            return StatusCode(StatusCodes.Status201Created, response);
        }

        // PUT /api/incidents/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Replace(int id, [FromBody] IncidentUpdateDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Incident not found."
                });
            }

            existing.Title = dto.Title;
            existing.Description = dto.Description;
            existing.Latitude = dto.Latitude;
            existing.Longitude = dto.Longitude;
            existing.Status = dto.Status;

            var updated = await _repository.UpdateAsync(existing);

            var response = new IncidentResponseDto
            {
                Id = updated!.Id,
                Title = updated.Title,
                Description = updated.Description,
                Latitude = updated.Latitude,
                Longitude = updated.Longitude,
                Status = updated.Status,
                CreatedAt = updated.CreatedAt
            };

            return Ok(response);
        }

        // PATCH /api/incidents/{id}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchStatus(int id, [FromBody] IncidentPatchStatusDto dto)
        {
            var updated = await _repository.UpdateStatusAsync(id, dto.Status);
            if (updated == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Incident not found."
                });
            }

            var response = new IncidentStatusResponseDto
            {
                Id = updated.Id,
                Status = updated.Status
            };

            return Ok(response);
        }

        // DELETE /api/incidents/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _repository.DeleteAsync(id);
            if (!ok)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Incident not found."
                });
            }

            return NoContent();
        }
    }
}
