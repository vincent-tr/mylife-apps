#!/usr/bin/env /bin/bash

package_version=$(node -p "require(path.join(process.cwd(), './package.json')).version")
docker build -t "vincenttr/mylife-explorer:$package_version" --build-arg "package_version=$package_version" - < "tools/Dockerfile"
