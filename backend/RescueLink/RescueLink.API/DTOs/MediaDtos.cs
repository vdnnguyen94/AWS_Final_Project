namespace RescueLink.API.DTOs
{
    public class MediaResponseDto
    {
        public int Id { get; set; }
        public int IncidentId { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class MediaUpdateDto
    {
        public string Description { get; set; } = string.Empty;
    }

    public class MediaPatchDescriptionDto
    {
        public string Description { get; set; } = string.Empty;
    }
}
