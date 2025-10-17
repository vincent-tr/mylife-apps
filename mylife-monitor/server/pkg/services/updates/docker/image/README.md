# Image

This package provides functions to fetch image tag → digest mappings.

## Default Registry Access

By default, the package uses the [`github.com/containers/image`](https://github.com/containers/image) library.  
This library implements the [OCI Distribution Spec](https://github.com/opencontainers/distribution-spec) and supports common registries such as:

- Docker Hub (`registry-1.docker.io`)
- Quay.io
- GHCR (GitHub Container Registry)
- Any OCI-compliant registry

Through this backend, the package can resolve image references (`<name>:<tag>`) into content digests.

## Optimized Path for Docker Hub

For repositories hosted on **Docker Hub**, the package uses the official Docker Hub REST API to fetch recent tags more efficiently:

```
https://hub.docker.com/v2/namespaces/<namespace>/repositories/<repo>/tags?page_size=100
```

For example, for the Debian image:

```
https://hub.docker.com/v2/namespaces/library/repositories/debian/tags?page_size=100
```

The response provides a direct list of tags with their corresponding digests, ordered by update time.  
This avoids iterating over all available tags via the generic OCI API.

## Behavior Summary

- **Non–Docker Hub registries**: use `containers/image` to resolve digests.  
- **Docker Hub repositories**: use the Docker Hub API to fetch the most recent tags with their digests.
