package images

import (
	"bytes"
	"image"
	"image/color"
	"image/png"
	"math/rand"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"time"
)

var logger = log.CreateLogger("mylife:server:images")

func init() {
	services.Register(&imagesService{})
}

type imagesConfig struct {
	/// Root path for images
	RootPath string `mapstructure:"rootPath"`

	/// One folder will be taken per period. If the period contains less images than minCount,
	/// another folder will be added until minCount is reached.
	MinCount int `mapstructure:"minCount"`

	/// Duration of a period (e.g. "24h" or "1d" for one day)
	PeriodDuration string `mapstructure:"periodDuration"`
}

type imagesService struct {
}

func (service *imagesService) Init(arg interface{}) error {
	imagesConfig := imagesConfig{}
	config.BindStructure("images", &imagesConfig)

	return nil
}

func (service *imagesService) Terminate() error {

	return nil
}

func (service *imagesService) ServiceName() string {
	return "images"
}

func (service *imagesService) Dependencies() []string {
	return []string{}
}

func getService() *imagesService {
	return services.GetService[*imagesService]("images")
}

// Public access

func GetNextImage() ([]byte, string) {
	width, height := 200, 200
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

	var buf bytes.Buffer
	if err := png.Encode(&buf, img); err != nil {
		panic(err)
	}

	return buf.Bytes(), "image/png"
}
