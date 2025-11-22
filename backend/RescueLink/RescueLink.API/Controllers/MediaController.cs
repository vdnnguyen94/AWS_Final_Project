using Microsoft.AspNetCore.Mvc;
using RescueLink.API.DTOs;
using RescueLink.API.Models;
using RescueLink.API.Repositories;
using RescueLink.API.Data;
using Microsoft.EntityFrameworkCore;

namespace RescueLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly IMediaRepository _mediaRepository;
        private readonly IIncidentRepository _incidentRepository;

        public MediaController(IMediaRepository mediaRepository, IIncidentRepository incidentRepository)
        {
            _mediaRepository = mediaRepository;
            _incidentRepository = incidentRepository;
        }

        // GET /api/media
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaResponseDto>>> GetAll()
        {
            var mediaItems = await _mediaRepository.GetAllAsync();
            var result = mediaItems.Select(m => new MediaResponseDto
            {
                Id = m.Id,
                IncidentId = m.IncidentId,
                Url = m.Url,
                Description = m.Description,
                UploadedAt = m.UploadedAt
            });

            return Ok(result);
        }

        // GET /api/media/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var media = await _mediaRepository.GetByIdAsync(id);
            if (media == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Media not found."
                });
            }

            var dto = new MediaResponseDto
            {
                Id = media.Id,
                IncidentId = media.IncidentId,
                Url = media.Url,
                Description = media.Description,
                UploadedAt = media.UploadedAt
            };

            return Ok(dto);
        }

        // POST /api/media (multipart/form-data)
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Upload(IFormFile file, [FromForm] int incidentId, [FromForm] string? description)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ErrorResponse
                {
                    Error = "BadRequest",
                    Message = "File is required."
                });
            }

            var incident = await _incidentRepository.GetByIdAsync(incidentId);
            if (incident == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Incident not found."
                });
            }

            // Save file locally under wwwroot/uploads for demo purposes
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            Directory.CreateDirectory(uploadsDir);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativeUrl = $"/uploads/{fileName}";

            var entity = new MediaItem
            {
                IncidentId = incidentId,
                Url = relativeUrl,
                Description = description ?? string.Empty,
                UploadedAt = DateTime.UtcNow
            };

            var created = await _mediaRepository.CreateAsync(entity);

            var response = new MediaResponseDto
            {
                Id = created.Id,
                IncidentId = created.IncidentId,
                Url = created.Url,
                Description = created.Description,
                UploadedAt = created.UploadedAt
            };

            return StatusCode(StatusCodes.Status201Created, response);
        }

        // PUT /api/media/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMetadata(int id, [FromBody] MediaUpdateDto dto)
        {
            var existing = await _mediaRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Media not found."
                });
            }

            existing.Description = dto.Description;

            var updated = await _mediaRepository.UpdateAsync(existing);

            var response = new MediaResponseDto
            {
                Id = updated!.Id,
                IncidentId = updated.IncidentId,
                Url = updated.Url,
                Description = updated.Description,
                UploadedAt = updated.UploadedAt
            };

            return Ok(response);
        }

        // PATCH /api/media/{id}
        [HttpPatch("{id:int}")]
        public async Task<IActionResult> PatchDescription(int id, [FromBody] MediaPatchDescriptionDto dto)
        {
            var existing = await _mediaRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Media not found."
                });
            }

            existing.Description = dto.Description;

            var updated = await _mediaRepository.UpdateAsync(existing);

            var response = new MediaResponseDto
            {
                Id = updated!.Id,
                IncidentId = updated.IncidentId,
                Url = updated.Url,
                Description = updated.Description,
                UploadedAt = updated.UploadedAt
            };

            return Ok(response);
        }

        // DELETE /api/media/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _mediaRepository.DeleteAsync(id);
            if (!ok)
            {
                return NotFound(new ErrorResponse
                {
                    Error = "NotFound",
                    Message = "Media not found."
                });
            }

            return NoContent();
        }
    }
}
