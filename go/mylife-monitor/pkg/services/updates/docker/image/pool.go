package image

import (
	"context"
	"sync"
)

type ParallelTaskPool struct {
	ctx    context.Context
	cancel context.CancelFunc
	wg     sync.WaitGroup
	err    error
	errMux sync.Mutex
}

func MakeParallelTaskPool(parent context.Context) *ParallelTaskPool {
	ctx, cancel := context.WithCancel(parent)
	return &ParallelTaskPool{
		ctx:    ctx,
		cancel: cancel,
	}
}

func (pool *ParallelTaskPool) Add(task func(context.Context) error) {
	pool.wg.Add(1)

	go func() {
		defer pool.wg.Done()

		err := task(pool.ctx)
		if err != nil {
			pool.setError(err)
		}
	}()
}

func (pool *ParallelTaskPool) setError(err error) {
	pool.errMux.Lock()
	defer pool.errMux.Unlock()

	if pool.err == nil {
		pool.err = err
		// on error cancel running tasks
		pool.cancel()
	}
}

func (pool *ParallelTaskPool) Wait() error {
	pool.wg.Wait()

	pool.cancel()

	return pool.err
}
