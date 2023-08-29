package cmd

import (
	ui "mylife-monitor-ui"
	"mylife-monitor/pkg/api"
	_ "mylife-monitor/pkg/services/nagios"
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
				"api": api.Definitions,
				"web": ui.FS,
			}

			services.RunServices([]string{"web", "nagios"}, args)
		},
	})
}
