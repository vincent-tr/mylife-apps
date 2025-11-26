package cmd

import (
	ui "mylife-portal-ui"
	"mylife-portal/pkg/entities"
	_ "mylife-portal/pkg/services/web"
	"mylife-tools/services"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(&cobra.Command{
		Use:   "web",
		Short: "Starts the web server",
		Run: func(_ *cobra.Command, _ []string) {
			args := map[string]interface{}{
				"store": entities.StoreDef,
				"web":   ui.FS,
			}

			services.RunServices([]string{"web"}, args)
		},
	})
}
