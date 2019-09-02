#!/usr/bin/env /bin/bash

package_name=$(node -p "require(path.join(process.cwd(), './package.json')).name")
package_version=$(node -p "require(path.join(process.cwd(), './package.json')).version")
docker build -t "$package_name:$package_version" --build-arg "package_name=$package_name" --build-arg "package_version=$package_version" - < "$(dirname $(realpath ${BASH_SOURCE}))/../tools/Dockerfile"
