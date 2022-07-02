#!/usr/bin/env /bin/bash

package_name=$(node -p "require(path.join(process.cwd(), './package.json')).name")
package_version=$(node -p "require(path.join(process.cwd(), './package.json')).version")
docker build --pull -t "vincenttr/$package_name:$package_version" -f "$(dirname $(realpath ${BASH_SOURCE}))/../docker/Dockerfile" .
docker push "vincenttr/$package_name:$package_version"
