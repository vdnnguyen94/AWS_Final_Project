using Microsoft.AspNetCore.Mvc;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using RescueLink.API.DTOs;
using RescueLink.API.Models;

namespace RescueLink.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncidentsController : ControllerBase
    {
        private readonly IDynamoDBContext _dynamoContext;

        public IncidentsController(IAmazonDynamoDB dynamoDbClient)
        {
            _dynamoContext = new DynamoDBContext(dynamoDbClient);
        }

        // GET /api/incidents
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Scan DynamoDB for all incidents
            var conditions = new List<ScanCondition>();
            var incidents = await _dynamoContext.ScanAsync<Incident>(conditions).GetRemainingAsync();
            return Ok(incidents);
        }

        // GET /api/incidents/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var incident = await _dynamoContext.LoadAsync<Incident>(id);
            if (incident == null) return NotFound();
            return Ok(incident);
        }

        // POST /api/incidents
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] IncidentCreateDto dto)
        {
            var newIncident = new Incident
            {
                IncidentID = Guid.NewGuid().ToString(),
                Title = dto.Title,
                Description = dto.Description,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                Status = "Open",
                ReportedAt = DateTime.UtcNow
            };

            await _dynamoContext.SaveAsync(newIncident);
            return CreatedAtAction(nameof(GetById), new { id = newIncident.IncidentID }, newIncident);
        }

        // Implement PUT/DELETE similarly using SaveAsync and DeleteAsync
    }
}