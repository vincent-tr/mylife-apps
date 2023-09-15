package cmd

import (
	ui "mylife-energy-ui"
	"mylife-energy/pkg/api"
	"mylife-energy/pkg/entities"
	_ "mylife-energy/pkg/services/live"
	_ "mylife-energy/pkg/services/tesla"
	"mylife-tools-server/services"
	_ "mylife-tools-server/services/api"
	_ "mylife-tools-server/services/web"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(&cobra.Command{
		Use:   "web",
		Short: "Starts the web server",
		Run: func(_ *cobra.Command, _ []string) {
			args := map[string]interface{}{
				"api":   api.Definitions,
				"store": entities.StoreDef,
				"web":   ui.FS,
			}

			services.RunServices([]string{"live", "tesla", "web"}, args)
		},
	})
}
