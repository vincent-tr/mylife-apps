package images

import (
	"io/fs"
	"os"
	"path"
	"path/filepath"
	"strings"

	ignore "github.com/sabhiram/go-gitignore"
)

// filteredFS is a filesystem that combines chroot and gitignore-style filtering.
// It provides a filtered view of files and directories based on .mylife-ignore patterns.
type filteredFS struct {
	baseFS fs.FS
	ignore *ignore.GitIgnore
}

var _ fs.FS = (*filteredFS)(nil)
var _ fs.ReadDirFS = (*filteredFS)(nil)
var _ fs.StatFS = (*filteredFS)(nil)

// NewFilteredFS creates a new filtered filesystem with chroot and gitignore-style filtering.
// The rootPath parameter specifies the absolute path to use as filesystem root (chroot).
// It automatically looks for a ".mylife-ignore" file in the root directory to determine
// which files and directories should be filtered out. If no ignore file exists,
// no filtering is applied.
func NewFilteredFS(rootPath string) (*filteredFS, error) {
	// Create chrooted filesystem using os.DirFS
	baseFS := os.DirFS(rootPath)

	// Look for .mylife-ignore file in the root
	ignoreFilePath := filepath.Join(rootPath, ".mylife-ignore")
	ignoreObj, err := ignore.CompileIgnoreFile(ignoreFilePath)
	if err != nil {
		if os.IsNotExist(err) {
			// No ignore file, create empty matcher
			ignoreObj = ignore.CompileIgnoreLines()
		} else {
			return nil, err
		}
	}

	return &filteredFS{
		baseFS: baseFS,
		ignore: ignoreObj,
	}, nil
}

// Open opens the named file for reading. It returns an error if the file
// is filtered out by the ignore patterns or if the file does not exist.
// If the opened file is a directory, it returns a filteredDir that applies
// filtering to ReadDir operations.
func (f *filteredFS) Open(name string) (fs.File, error) {
	// Normalize path
	name = f.normalizePath(name)

	// Check if path is ignored
	if f.isIgnored(name) {
		return nil, &fs.PathError{Op: "open", Path: name, Err: fs.ErrNotExist}
	}

	// Open file from base filesystem
	file, err := f.baseFS.Open(name)
	if err != nil {
		return nil, err
	}

	// If it's a directory, wrap it with filtering
	if info, err := file.Stat(); err == nil && info.IsDir() {
		return &filteredDir{
			File: file,
			fs:   f,
			path: name,
		}, nil
	}

	return file, nil
}

// ReadDir reads the directory named by name and returns a list of directory entries,
// filtered according to the ignore patterns. Entries that match the ignore patterns
// are excluded from the result.
func (f *filteredFS) ReadDir(name string) ([]fs.DirEntry, error) {
	// Normalize path
	name = f.normalizePath(name)

	// Check if directory itself is ignored
	if f.isIgnored(name) {
		return nil, &fs.PathError{Op: "readdir", Path: name, Err: fs.ErrNotExist}
	}

	// Read directory from base filesystem
	entries, err := fs.ReadDir(f.baseFS, name)
	if err != nil {
		return nil, err
	}

	// Filter out ignored entries
	var filtered []fs.DirEntry
	for _, entry := range entries {
		entryPath := path.Join(name, entry.Name())
		if !f.isIgnored(entryPath) {
			filtered = append(filtered, entry)
		}
	}

	return filtered, nil
}

// Stat returns a FileInfo describing the named file. It returns an error
// if the file is filtered out by the ignore patterns or if the file does not exist.
func (f *filteredFS) Stat(name string) (fs.FileInfo, error) {
	// Normalize path
	name = f.normalizePath(name)

	// Check if path is ignored
	if f.isIgnored(name) {
		return nil, &fs.PathError{Op: "stat", Path: name, Err: fs.ErrNotExist}
	}

	return fs.Stat(f.baseFS, name)
}

// isIgnored checks if a path should be ignored according to the gitignore patterns.
// It returns true if the path matches any ignore pattern, false otherwise.
func (f *filteredFS) isIgnored(name string) bool {
	if f.ignore == nil {
		return false
	}
	return f.ignore.MatchesPath(name)
}

// normalizePath cleans and normalizes the path for use with fs.FS.
// It removes leading slashes and handles root directory references properly.
func (f *filteredFS) normalizePath(name string) string {
	// Clean the path
	name = path.Clean(name)

	// Remove leading slash (fs.FS paths are relative)
	name = strings.TrimPrefix(name, "/")

	// Handle root directory
	if name == "" || name == "." {
		name = "."
	}

	return name
}

// filteredDir is a wrapper for directory files that applies filtering to ReadDir calls.
// It ensures that directory listing operations respect the ignore patterns.
type filteredDir struct {
	fs.File
	fs   *filteredFS
	path string
}

var _ fs.ReadDirFile = (*filteredDir)(nil)

// ReadDir reads up to n entries from the filtered directory. If n <= 0,
// it reads all remaining entries. The returned entries are filtered according
// to the ignore patterns.
func (d *filteredDir) ReadDir(n int) ([]fs.DirEntry, error) {
	// Get all entries first
	entries, err := d.fs.ReadDir(d.path)
	if err != nil {
		return nil, err
	}

	// If n <= 0, return all entries
	if n <= 0 {
		return entries, nil
	}

	// Return up to n entries
	if len(entries) > n {
		entries = entries[:n]
	}

	return entries, nil
}
