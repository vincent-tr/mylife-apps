module mylife-idly

go 1.24.2

replace mylife-tools-server => ../../common/server

require (
	github.com/gorilla/mux v1.8.1
	github.com/spf13/cobra v1.9.1
	mylife-tools-server v0.0.0-00010101000000-000000000000
)
