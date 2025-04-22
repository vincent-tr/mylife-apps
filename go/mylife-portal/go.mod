module mylife-portal

go 1.24.2

replace mylife-tools-server => ../mylife-tools-server

require (
	go.mongodb.org/mongo-driver v1.11.4
	mylife-tools-server v0.0.0-00010101000000-000000000000
)

require (
	github.com/aymerick/raymond v2.0.2+incompatible // indirect
	github.com/gorilla/mux v1.8.0 // indirect
	github.com/inconshreveable/mousetrap v1.1.0 // indirect
	github.com/spf13/cobra v1.7.0 // indirect
	github.com/spf13/pflag v1.0.5 // indirect
)
