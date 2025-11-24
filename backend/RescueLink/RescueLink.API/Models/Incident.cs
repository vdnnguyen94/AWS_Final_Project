using Amazon.DynamoDBv2.DataModel;

namespace RescueLink.API.Models
{
    [DynamoDBTable("Incidents")] // Maps to your DynamoDB table
    public class Incident
    {
        [DynamoDBHashKey] // Partition Key
        public string IncidentID { get; set; }

        [DynamoDBProperty]
        public string Title { get; set; } = string.Empty;

        [DynamoDBProperty]
        public string Description { get; set; } = string.Empty;

        [DynamoDBProperty]
        public double Latitude { get; set; }

        [DynamoDBProperty]
        public double Longitude { get; set; }

        [DynamoDBProperty]
        public string Status { get; set; } = "Open";

        [DynamoDBProperty]
        public DateTime ReportedAt { get; set; } = DateTime.UtcNow; // Matches your Controller

        [DynamoDBProperty]
        public List<string> MediaUrls { get; set; } = new List<string>();
    }
}