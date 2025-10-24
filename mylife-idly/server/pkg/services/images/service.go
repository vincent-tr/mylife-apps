package images

import (
	"bytes"
	"image"
	"image/jpeg"
	"io/fs"
	"math/rand"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"strings"
	"sync"
	"time"

	"golang.org/x/image/draw"
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
	chooserLock     sync.Mutex
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

	entries, err := fs.ReadDir(service.fs, ".")
	if err != nil {
		logger.WithError(err).Error("Failed to read root directory")
	} else {
		for _, entry := range entries {
			if entry.IsDir() {
				logger.Infof("Image folder: %s", entry.Name())
			}
		}
	}

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

func (service *imagesService) getNextImage(smallDevice bool) ([]byte, string, error) {
	chooser, err := service.getChooser()
	if err != nil {
		return nil, "", err
	}

	content, contentType, err := chooser.GetNextImage()
	if err != nil {
		return nil, "", err
	}

	if smallDevice {
		return service.reduceImage(content, contentType)
	} else {
		return content, contentType, nil
	}
}

func (service *imagesService) reduceImage(content []byte, contentType string) ([]byte, string, error) {
	// Decode the image
	img, _, err := image.Decode(bytes.NewReader(content))
	if err != nil {
		return nil, "", err
	}

	// Get original dimensions
	bounds := img.Bounds()
	origWidth := bounds.Dx()
	origHeight := bounds.Dy()

	// Calculate new dimensions (max 1024 on longest side)
	maxSize := 1024
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
		return nil, "", err
	}

	logger.Debugf("Reduced image from %d bytes (%s) to %d bytes (image/jpeg)", len(content), contentType, buf.Len())

	return buf.Bytes(), "image/jpeg", err
}

func (service *imagesService) getChooser() (*chooser, error) {
	service.chooserLock.Lock()
	defer service.chooserLock.Unlock()

	if err := service.refreshChooser(); err != nil {
		return nil, err
	}

	return service.currentChooser, nil
}

func (service *imagesService) refreshChooser() error {
	if service.currentChooser != nil && time.Since(service.lastChooserTime) < service.chooserDuration {
		return nil
	}

	logger.Infof("Creating new image chooser")

	folders, err := service.selectFolders()
	if err != nil {
		return err
	}

	chooser := makeChooser(service.fs)

	// Add folders until we have enough images
	for _, folder := range folders {
		if err := chooser.AddSource(folder); err != nil {
			logger.WithError(err).Errorf("Failed to add source folder: '%s'", folder)
			continue
		}

		if chooser.ImageCount() >= service.imagesMinCount {
			break
		}
	}

	if chooser.ImageCount() < service.imagesMinCount {
		logger.Warnf("Not enough images (%d) found to meet minimum count (%d)", chooser.ImageCount(), service.imagesMinCount)
	}

	// Prepare the chooser
	chooser.Prepare()

	logger.Infof("Image chooser created with %d folders and %d images", len(chooser.GetSources()), chooser.ImageCount())

	service.currentChooser = chooser
	service.lastChooserTime = time.Now()

	return nil
}

func (service *imagesService) selectFolders() ([]string, error) {
	var folders []string

	// Read the root directory
	entries, err := fs.ReadDir(service.fs, ".")
	if err != nil {
		return nil, err
	}

	// Collect all directories
	for _, entry := range entries {
		if entry.IsDir() {
			folders = append(folders, entry.Name())
		}
	}

	// Avoid folders of current chooser
	if service.currentChooser != nil {
		usedFolders := make(map[string]bool)
		for _, src := range service.currentChooser.sources {
			usedFolders[src] = true
		}

		filtered := make([]string, 0)
		for _, folder := range folders {
			if !usedFolders[folder] {
				filtered = append(filtered, folder)
			}
		}

		folders = filtered
	}

	// Shuffle folders for randomness
	rand.Shuffle(len(folders), func(i, j int) {
		folders[i], folders[j] = folders[j], folders[i]
	})

	return folders, nil
}

func (service *imagesService) safeGetNextImage(smallDevice bool) ([]byte, string) {
	content, contentType, err := getService().getNextImage(smallDevice)
	if err != nil {
		logger.WithError(err).Error("GetNextImage failed")
		return service.generateErrorImage()
	}

	return content, contentType
}

func (service *imagesService) generateErrorImage() ([]byte, string) {
	// Simple placeholder image (1x1 pixel transparent PNG)
	placeholder := []byte{
		0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
		0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
		0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
		0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
		0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44,
		0x41, 0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00,
		0x00, 0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4,
		0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
		0xAE, 0x42, 0x60, 0x82,
	}

	return placeholder, "image/png"
}

func (service *imagesService) getAlbumName() string {
	chooser, err := service.getChooser()
	if err != nil {
		logger.WithError(err).Error("Failed to refresh chooser")
		return ""
	}

	if chooser == nil {
		return ""
	}

	sources := chooser.GetSources()
	if len(sources) == 0 {
		return ""
	}

	return strings.Join(sources, ", ")
}

func getService() *imagesService {
	return services.GetService[*imagesService]("images")
}

// Public access

func GetNextImage(smallDevice bool) ([]byte, string) {
	return getService().safeGetNextImage(smallDevice)
}

func GetAlbumName() string {
	return getService().getAlbumName()
}
