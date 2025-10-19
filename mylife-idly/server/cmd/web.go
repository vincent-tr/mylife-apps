package cmd

import (
	ui "mylife-idly-ui"
	"mylife-idly/pkg/entities"
	_ "mylife-idly/pkg/services/web"
	"mylife-tools-server/services"

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
