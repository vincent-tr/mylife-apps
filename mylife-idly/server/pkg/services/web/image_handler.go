package web

import (
	"bytes"
	"image"
	"image/color"
	"image/png"
	"math/rand"
	"net/http"
	"time"
)

type imageHandler struct {
}

func makeImageHandler() *imageHandler {
	ih := &imageHandler{}

	return ih
}

func (ih *imageHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Generate a random dummy image for testing
	dummyImage := ih.generateRandomImage(200, 200)

	// Set headers to disable caching
	w.Header().Set("Content-Type", "image/png")
	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")

	// Encode and serve the image
	var buf bytes.Buffer
	if err := png.Encode(&buf, dummyImage); err != nil {
		logger.WithError(err).Error("Error encoding dummy image")
		http.Error(w, "500 Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(200)
	w.Write(buf.Bytes())
}

// generateRandomImage creates a simple colored rectangle with random colors
func (ih *imageHandler) generateRandomImage(width, height int) image.Image {
	// Seed random number generator with current time for different results each call
	rand.Seed(time.Now().UnixNano())

	// Create a new RGBA image
	img := image.NewRGBA(image.Rect(0, 0, width, height))

	// Generate random colors
	r := uint8(rand.Intn(256))
	g := uint8(rand.Intn(256))
	b := uint8(rand.Intn(256))

	// Fill the image with the random color
	c := color.RGBA{r, g, b, 255}
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			img.Set(x, y, c)
		}
	}

	return img
}
