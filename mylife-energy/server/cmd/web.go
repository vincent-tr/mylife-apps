package cmd

import (
	ui "mylife-energy-ui"
	"mylife-energy/pkg/api"
	"mylife-energy/pkg/entities"
	_ "mylife-energy/pkg/services/live"
	_ "mylife-energy/pkg/services/tesla"
	teslaCert "mylife-energy/tesla-cert"
	"mylife-tools/services"
	_ "mylife-tools/services/api"
	_ "mylife-tools/services/monitor"
	_ "mylife-tools/services/web"

	"github.com/yalue/merged_fs"

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
				"web":   merged_fs.NewMergedFS(ui.FS, teslaCert.FS),
			}

			services.RunServices([]string{"monitor", "live", "tesla", "web"}, args)
		},
	})
}
