using RescueLink.API.DTOs;

namespace RescueLink.API.Middlewares
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string HeaderName = "x-api-key";

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IConfiguration config)
        {
            var expectedApiKey = config["ApiKey"];

            var provided =
                context.Request.Headers[HeaderName].FirstOrDefault()
                ?? context.Request.Query["apikey"].FirstOrDefault();

            if (string.IsNullOrEmpty(expectedApiKey) || provided != expectedApiKey)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                var error = new ErrorResponse
                {
                    Error = "BadRequest",
                    Message = "Missing or invalid API key."
                };
                await context.Response.WriteAsJsonAsync(error);
                return;
            }

            await _next(context);
        }
    }
}
