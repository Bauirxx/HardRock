export function getYouTubeEmbedUrl(videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeThumbnail(videoId) {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : url;
}

export function getYouTubeId(url) {
    return extractYouTubeId(url);
}
