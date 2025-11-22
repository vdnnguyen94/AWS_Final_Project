using Microsoft.EntityFrameworkCore;
using RescueLink.API.Data;
using RescueLink.API.Middlewares;
using RescueLink.API.Repositories;
using RescueLink.API.Repositories.Sql;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

//
// Database (SQL Server / RDS)
// Prefer RDS_* environment variables (from env file / ECS),
// fall back to local appsettings / dev defaults.
//
var rdsHost = Environment.GetEnvironmentVariable("RDS_HOST");
var rdsDb   = Environment.GetEnvironmentVariable("RDS_DB");
var rdsUser = Environment.GetEnvironmentVariable("RDS_USER");
var rdsPwd  = Environment.GetEnvironmentVariable("RDS_PWD");

string connectionString;

if (!string.IsNullOrWhiteSpace(rdsHost) &&
    !string.IsNullOrWhiteSpace(rdsDb) &&
    !string.IsNullOrWhiteSpace(rdsUser) &&
    !string.IsNullOrWhiteSpace(rdsPwd))
{
    // Shared RDS used by the team (what your teammate expects)
    connectionString =
        $"Server={rdsHost},1433;Database={rdsDb};User Id={rdsUser};Password={rdsPwd};Encrypt=True;TrustServerCertificate=True";
}
else
{
    // Local dev fallbacks
    connectionString =
        builder.Configuration.GetConnectionString("RescueLinkDb")
        ?? builder.Configuration["RDS_CONNECTION_STRING"]
        ?? "Server=localhost;Database=RescueLinkDb;Trusted_Connection=True;TrustServerCertificate=True";
}

builder.Services.AddDbContext<RescueLinkDbContext>(options =>
    options.UseSqlServer(connectionString));

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IIncidentRepository, IncidentRepository>();
builder.Services.AddScoped<IMediaRepository, MediaRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

// Serve static files for uploaded media (e.g., /uploads)
app.UseStaticFiles();

// CORS
app.UseCors("FrontendCors");

// API key middleware (x-api-key)
app.UseMiddleware<ApiKeyMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();
