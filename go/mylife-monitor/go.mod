module mylife-monitor

go 1.20

replace mylife-tools-server => ../mylife-tools-server

require mylife-tools-server v0.0.0-00010101000000-000000000000

require (
	github.com/inconshreveable/mousetrap v1.1.0 // indirect
	github.com/spf13/cobra v1.7.0 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
)
