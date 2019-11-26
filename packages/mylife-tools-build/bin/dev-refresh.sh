#!/usr/bin/env /bin/bash

base_dir="$PWD/.."
current=$(basename $PWD)
repositories=mylife-tools-common,mylife-tools-server,mylife-tools-ui,mylife-tools-build,$current

for repository in ${repositories//,/ }
do
  pushd $base_dir/$repository
  git pull
  npm i
  popd
done
