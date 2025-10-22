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

func (service *imagesService) getNextImage() ([]byte, string, error) {
	if err := service.refreshChooser(); err != nil {
		return nil, "", err
	}

	return service.currentChooser.GetNextImage()
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

func (service *imagesService) safeGetNextImage() ([]byte, string) {
	content, contentType, err := getService().getNextImage()
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

func getService() *imagesService {
	return services.GetService[*imagesService]("images")
}

// Public access

func GetNextImage() ([]byte, string) {
	return getService().safeGetNextImage()
}
