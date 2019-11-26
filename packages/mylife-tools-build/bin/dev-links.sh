#!/usr/bin/env /bin/bash

base_dir="$PWD/.."
current=$(basename $PWD)

# TODO: check in dependencies if package present

pushd $base_dir/mylife-tools-common
npm link
popd

pushd $base_dir/mylife-tools-build
npm link
popd

pushd $base_dir/mylife-tools-ui
npm link
npm link mylife-tools-common
popd

pushd $base_dir/mylife-tools-server
npm link
npm link mylife-tools-common
npm link mylife-tools-build
popd

pushd $base_dir/$current
npm link mylife-tools-common
npm link mylife-tools-server
npm link mylife-tools-ui
npm link mylife-tools-build
popd
