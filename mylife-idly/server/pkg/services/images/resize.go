package images

import (
	"bytes"
	"image"
	"image/jpeg"

	"golang.org/x/image/draw"
)

func reduceImage(imgData *ImageData, maxSize int) error {
	// Decode the image
	img, _, err := image.Decode(bytes.NewReader(imgData.Content))
	if err != nil {
		return err
	}

	// Get original dimensions
	bounds := img.Bounds()
	origWidth := bounds.Dx()
	origHeight := bounds.Dy()

	// Calculate new dimensions and resize if necessary
	if origWidth > maxSize || origHeight > maxSize {
		// Calculate scaling factor
		var newWidth, newHeight int
		if origWidth > origHeight {
			newWidth = maxSize
			newHeight = (origHeight * maxSize) / origWidth
		} else {
			newHeight = maxSize
			newWidth = (origWidth * maxSize) / origHeight
		}

		// Create new image with calculated dimensions
		resized := image.NewRGBA(image.Rect(0, 0, newWidth, newHeight))

		// Resize using high-quality scaling
		draw.BiLinear.Scale(resized, resized.Bounds(), img, img.Bounds(), draw.Over, nil)

		img = resized
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
