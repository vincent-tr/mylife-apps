package cmd

import (
	_ "mylife-energy/pkg/services/collector"
	"mylife-tools/services"

	"github.com/spf13/cobra"
)

func init() {
	rootCmd.AddCommand(&cobra.Command{
		Use:   "collector",
		Short: "Starts the collector",
		Run: func(_ *cobra.Command, _ []string) {
			args := map[string]interface{}{}

			services.RunServices([]string{"collector"}, args)
		},
	})
}
