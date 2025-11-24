using Microsoft.AspNetCore.Mvc;

namespace RescueLink.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "Hello from RescueLink API! Connection is good." });
        }
    }
}