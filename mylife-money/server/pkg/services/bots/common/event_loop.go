package common

import "mylife-tools-server/services/tasks"

func RunEventLoopWithError(taskName string, taskImpl func() error) error {

	wrapper := newErrorWrapper(taskImpl)

	err := tasks.RunEventLoop(taskName, wrapper.Run)

	if err != nil {
		return err
	}

	return wrapper.Error()
}

type errorWrapper struct {
	err    error
	target func() error
}

func newErrorWrapper(target func() error) *errorWrapper {
	return &errorWrapper{
		target: target,
	}
}

func (ew *errorWrapper) Error() error {
	return ew.err
}

func (ew *errorWrapper) Run() {
	ew.err = ew.target()
}
