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

## Optimized Path for Quay.io

For `quay.io`, the package uses the Quay API (`/api/v1/repository/<ns>/<repo>/tag/`) which returns tags with digests.
If the repository has no `latest` tag (eg: jetstack/cert-manager), the highest stable semver tag is used.

## Generic Path

For every other registry (ghcr.io, ...), `latest` is resolved to a real version by listing tags (anonymous OCI API),
keeping dotted versions, and comparing the digests of the 15 most recent ones with the digest of `latest`.

## Behavior Summary

- **Docker Hub**: Docker Hub API.
- **Quay.io**: Quay API.
- **Others**: OCI distribution API through `containers/image`.
