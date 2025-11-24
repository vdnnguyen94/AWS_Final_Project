using Microsoft.EntityFrameworkCore;
using RescueLink.API.Data;
using RescueLink.API.Middlewares;
using RescueLink.API.Repositories;
using RescueLink.API.Repositories.Sql;
using DotNetEnv;
using Amazon.S3;
using Amazon.DynamoDBv2;
using Amazon.Runtime;

var builder = WebApplication.CreateBuilder(args);
// 2. Load the .env file immediately
Env.Load();
// 1. Get AWS Credentials from .env
var awsKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
var awsSecret = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION");
var awsOptions = new Amazon.Extensions.NETCore.Setup.AWSOptions
{
    Credentials = new BasicAWSCredentials(awsKey, awsSecret),
    Region = Amazon.RegionEndpoint.GetBySystemName(awsRegion)
};

// 2. Register AWS Services
builder.Services.AddDefaultAWSOptions(awsOptions);
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddAWSService<IAmazonDynamoDB>();
// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS: Allow any origin (for local dev + cloud frontend)
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

// ---------------------------------------------------------
// Database Configuration (Environment Variables Priority)
// ---------------------------------------------------------
var rdsHost = Environment.GetEnvironmentVariable("RDS_HOST");
var rdsDb = Environment.GetEnvironmentVariable("RDS_DB");
var rdsUser = Environment.GetEnvironmentVariable("RDS_USER");
var rdsPwd = Environment.GetEnvironmentVariable("RDS_PWD");

string connectionString;

if (!string.IsNullOrWhiteSpace(rdsHost) &&
    !string.IsNullOrWhiteSpace(rdsDb) &&
    !string.IsNullOrWhiteSpace(rdsUser) &&
    !string.IsNullOrWhiteSpace(rdsPwd))
{
    // Production / Docker (Env Vars exist)
    connectionString = $"Server={rdsHost},1433;Database={rdsDb};User Id={rdsUser};Password={rdsPwd};Encrypt=True;TrustServerCertificate=True";
}
else
{
    // Local Development Fallback (appsettings.json)
    connectionString = builder.Configuration.GetConnectionString("RescueLinkDb")
        ?? "Server=localhost;Database=RescueLinkDb;Trusted_Connection=True;TrustServerCertificate=True";
}

builder.Services.AddDbContext<RescueLinkDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();


var app = builder.Build();

// ---------------------------------------------------------
// 🚀 STARTUP CONNECTION CHECK
// ---------------------------------------------------------
Console.ForegroundColor = ConsoleColor.Cyan;
Console.WriteLine($"\n--------------------------------------------------");
Console.WriteLine($"Launching in Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"--------------------------------------------------");
Console.ResetColor();

using (var scope = app.Services.CreateScope())
{
    try
    {
        var db = scope.ServiceProvider.GetRequiredService<RescueLinkDbContext>();
        Console.Write("Testing Database Connection... ");

        if (db.Database.CanConnect())
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("SUCCESS!");
        }
        else
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("FAILED (CanConnect returned false)");
        }
    }
    catch (Exception ex)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine($"ERROR: {ex.Message}");
    }
    Console.ResetColor();
    Console.WriteLine($"--------------------------------------------------\n");
}
// ---------------------------------------------------------


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Keep disabled for this setup

app.UseStaticFiles();

app.UseCors("FrontendCors");

app.UseMiddleware<ApiKeyMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();