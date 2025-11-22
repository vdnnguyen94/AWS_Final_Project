namespace RescueLink.API.Models
{
    public class MediaItem
    {
        public int Id { get; set; }
        public int IncidentId { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public Incident? Incident { get; set; }
    }
}
