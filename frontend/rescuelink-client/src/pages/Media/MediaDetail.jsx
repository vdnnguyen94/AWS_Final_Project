import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import mediaApi from "../../api/mediaApi";

function getMediaType(url) {
  if (!url) return "unknown";
  const lower = url.toLowerCase();

  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".gif")
  ) {
    return "image";
  }

  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".mp3") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg")
  ) {
    return "video";
  }

  return "unknown";
}

function MediaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await mediaApi.getById(id);
        setMedia(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load media item.");
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, [id]);

  if (loading) return <p>Loading media...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!media) return <p>No media found.</p>;

  const type = getMediaType(media.url);
  const uploadedAtText = media.uploadedAt
    ? new Date(media.uploadedAt).toLocaleString()
    : "-";

  return (
    <div>
      <div className="detail-card">
        <div className="detail-top-row">
          <div className="detail-section-title">
            <h2>Media Detail</h2>
          </div>
          <div className="detail-actions detail-actions-right">
            <button onClick={() => navigate(`/media/${media.id}/edit`)}>
              Edit
            </button>
            <button onClick={() => navigate("/media")}>
              Back to list
            </button>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-row two-column">
            <div>
              <span className="detail-label">Id</span>
              <span className="detail-value">{media.id}</span>
            </div>
            <div>
              <span className="detail-label">Incident Id</span>
              <span className="detail-value">{media.incidentId ?? "-"}</span>
            </div>
          </div>

          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">
              {media.description || "-"}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Uploaded At</span>
            <span className="detail-value">{uploadedAtText}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">File</span>
            <span className="detail-value">
              {media.url ? (
                <a href={media.url} target="_blank" rel="noreferrer">
                  {media.url}
                </a>
              ) : (
                "N/A"
              )}
            </span>
          </div>
        </div>

        {media.url && (
          <div className="detail-preview">
            <span className="detail-label">Preview</span>
            <div className="detail-preview-box">
              {type === "image" && (
                <img
                  src={media.url}
                  alt={media.description || "media preview"}
                  className="detail-preview-media"
                />
              )}

              {type === "video" && (
                <video
                  controls
                  src={media.url}
                  className="detail-preview-media"
                />
              )}

              {type === "unknown" && (
                <p className="detail-value">
                  Preview is not available for this file type.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaDetail;
