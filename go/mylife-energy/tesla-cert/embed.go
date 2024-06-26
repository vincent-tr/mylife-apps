package teslaCert

import (
	"bytes"
	"embed"
	"io/fs"
	"os"
	"time"
)

//go:embed public.pem
var content []byte

var FS fs.FS

// just to keep import live
var _ embed.FS

func init() {
	FS = &singleFileFs{".well-known/appspecific/com.tesla.3p.public-key.pem", content}
}

type singleFileFs struct {
	path string
	data []byte
}

func (sfs *singleFileFs) Open(name string) (fs.File, error) {
	if name != sfs.path {
		return nil, fs.ErrNotExist
	}

	info := singleFileFsFileInfo{name: name, data: sfs.data}
	file := &singleFileFsFile{bytes.NewReader(sfs.data), info}
	return file, nil
}

type singleFileFsFile struct {
	*bytes.Reader
	info singleFileFsFileInfo
}

func (file *singleFileFsFile) Close() error { return nil }

func (file *singleFileFsFile) Readdir(count int) ([]os.FileInfo, error) {
	return nil, nil
}

func (file *singleFileFsFile) Stat() (os.FileInfo, error) {
	return file.info, nil
}

type singleFileFsFileInfo struct {
	name string
	data []byte
}

func (info singleFileFsFileInfo) Name() string       { return info.name }
func (info singleFileFsFileInfo) Size() int64        { return int64(len(info.data)) }
func (info singleFileFsFileInfo) Mode() os.FileMode  { return 0444 }        // Read for all
func (info singleFileFsFileInfo) ModTime() time.Time { return time.Time{} } // Return anything
func (info singleFileFsFileInfo) IsDir() bool        { return false }
func (info singleFileFsFileInfo) Sys() interface{}   { return nil }
