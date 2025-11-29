package images

import (
	"bytes"
	"image/jpeg"

	"github.com/disintegration/imaging"
)

func reduceImage(imgData *ImageData, maxSize int) error {
	// Decode the image with automatic EXIF orientation correction
	img, err := imaging.Decode(bytes.NewReader(imgData.Content), imaging.AutoOrientation(true))
	if err != nil {
		return err
	}

	// Get original dimensions
	bounds := img.Bounds()
	origWidth := bounds.Dx()
	origHeight := bounds.Dy()

	// Resize if necessary using high-quality algorithm
	if origWidth > maxSize || origHeight > maxSize {
		// Use imaging.Fit to maintain aspect ratio and fit within maxSize
		img = imaging.Fit(img, maxSize, maxSize, imaging.Lanczos)
	}

	// Re-encode with lower quality
	var buf bytes.Buffer
	err = jpeg.Encode(&buf, img, &jpeg.Options{Quality: 70})
	if err != nil {
		return err
	}

	logger.Debugf("Reduced image from %d bytes (%s) to %d bytes (image/jpeg)", len(imgData.Content), imgData.ContentType, buf.Len())

	imgData.Content = buf.Bytes()
	imgData.ContentType = "image/jpeg"

	return nil
}
