package images

import (
	"io/fs"
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
	fs              fs.FS
	currentChooser  *chooser
	imagesMinCount  int
	chooserDuration time.Duration
	lastChooserTime time.Time
}

func (service *imagesService) Init(arg interface{}) error {
	var err error

	imagesConfig := imagesConfig{}
	config.BindStructure("images", &imagesConfig)

	service.imagesMinCount = imagesConfig.MinCount
	service.chooserDuration, err = parseDuration(imagesConfig.PeriodDuration)
	if err != nil {
		return err
	}

	service.fs, err = NewFilteredFS(imagesConfig.RootPath)
	if err != nil {
		return err
	}

	logger.Infof("Images service initialized with rootPath='%s', minCount=%d, periodDuration='%s'", imagesConfig.RootPath, service.imagesMinCount, formatDuration(service.chooserDuration))

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
	// TODO
	width, height := 200, 200

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
