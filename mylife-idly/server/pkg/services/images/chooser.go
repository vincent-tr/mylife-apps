package images

import (
	"io/fs"
	"math/rand"
	"path/filepath"
	"strings"
	"time"
)

type chooser struct {
	fs        fs.FS
	sources   []string
	images    []string
	lastIndex int
}

func makeChooser(fs fs.FS) *chooser {
	return &chooser{
		fs:      fs,
		sources: make([]string, 0),
		images:  make([]string, 0),
	}
}

func (c *chooser) AddSource(source string) error {
	// Scan the source directory recursively for image files
	images := make([]string, 0)

	err := fs.WalkDir(c.fs, source, func(path string, info fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() && isImage(path) {
			images = append(images, path)
		}

		return nil
	})

	if err != nil {
		return err
	}

	c.sources = append(c.sources, source)
	c.images = append(c.images, images...)

	logger.Debugf("Added source '%s' with %d images (total images: %d)", source, len(images), len(c.images))

	return nil
}

func (c *chooser) Prepare() {
	// Shuffle the images slice for random order using Fisher-Yates algorithm
	if len(c.images) <= 1 {
		return // Nothing to shuffle
	}

	// Create a new random source with current time as seed
	r := rand.New(rand.NewSource(time.Now().UnixNano()))

	// Fisher-Yates shuffle
	for i := len(c.images) - 1; i > 0; i-- {
		j := r.Intn(i + 1)
		c.images[i], c.images[j] = c.images[j], c.images[i]
	}

	// Reset index after shuffle
	c.lastIndex = -1

	logger.Debugf("Shuffled %d images for random playback", len(c.images))
}

func (c *chooser) ImageCount() int {
	return len(c.images)
}

func (c *chooser) GetNextImage() ([]byte, string, error) {
	c.lastIndex = (c.lastIndex + 1) % len(c.images)
	path := c.images[c.lastIndex]

	// Load the image file
	content, err := fs.ReadFile(c.fs, path)
	if err != nil {
		return nil, "", err
	}

	contentType := getMimeType(path)

	logger.Debugf("Loaded image: %s (%d bytes, '%s')", path, len(content), contentType)

	return content, contentType, nil
}

func getMimeType(filename string) string {
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
	default:
		// Return nothing, useful to test if supported
		return ""
	}
}

func isImage(filename string) bool {
	mime := getMimeType(filename)
	return mime != ""
}
