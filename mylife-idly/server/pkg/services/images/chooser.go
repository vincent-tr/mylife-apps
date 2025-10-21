package images

import (
	"os"
	"path"
	"path/filepath"
	"strings"
)

type chooser struct {
	rootPath  string
	sources   []string
	images    []string
	lastIndex int
}

func makeChooser(rootPath string, sources []string, images []string) *chooser {
	return &chooser{
		rootPath: rootPath,
		sources:  sources,
		images:   images,
	}
}

func (c *chooser) getNextImagePath() ([]byte, string) {
	c.lastIndex = (c.lastIndex + 1) % len(c.images)

	fullPath := path.Join(c.rootPath, c.images[c.lastIndex])

	// Load the image file
	content, err := os.ReadFile(fullPath)
	if err != nil {
		logger.WithError(err).Errorf("Failed to read image file: %s", fullPath)
		// Return empty content with error - caller should handle this
		return nil, ""
	}

	// Get MIME type based on file extension
	contentType := c.getMimeTypeFromExtension(fullPath)

	logger.Debugf("Loaded image: %s (%d bytes, %s)", fullPath, len(content), contentType)

	return content, contentType
}

// getMimeTypeFromExtension returns the MIME type based on file extension
func (c *chooser) getMimeTypeFromExtension(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))

	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".gif":
		return "image/gif"
	case ".webp":
		return "image/webp"
	case ".bmp":
		return "image/bmp"
	case ".svg":
		return "image/svg+xml"
	case ".tiff", ".tif":
		return "image/tiff"
	case ".ico":
		return "image/x-icon"
	default:
		// Default to JPEG for unknown image extensions
		return "image/jpeg"
	}
}
