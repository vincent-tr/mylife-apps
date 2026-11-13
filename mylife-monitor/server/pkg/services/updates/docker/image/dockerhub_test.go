package image

import "testing"

func TestDockerHubFindTagsMatchingImages(t *testing.T) {
	latest := DockerTag{
		Name:   "latest",
		Digest: "index-latest",
		Images: []DockerImage{
			{OS: "linux", Architecture: "amd64", Digest: "amd64-v18.7"},
			{OS: "linux", Architecture: "arm64", Variant: stringPointer("v8"), Digest: "arm64-v18.7"},
			{OS: "linux", Architecture: "riscv64", Digest: "riscv64-v18.7"},
			{OS: "unknown", Architecture: "unknown", Digest: "attestation-latest"},
		},
	}
	versioned := DockerTag{
		Name:   "18.7",
		Digest: "index-18.7",
		Images: []DockerImage{
			{OS: "linux", Architecture: "amd64", Digest: "amd64-v18.7"},
			{OS: "linux", Architecture: "arm64", Variant: stringPointer("v8"), Digest: "arm64-v18.7"},
			{OS: "unknown", Architecture: "unknown", Digest: "attestation-18.7"},
		},
	}
	older := DockerTag{
		Name:   "18.6",
		Digest: "index-18.6",
		Images: []DockerImage{
			{OS: "linux", Architecture: "amd64", Digest: "amd64-v18.6"},
			{OS: "linux", Architecture: "arm64", Variant: stringPointer("v8"), Digest: "arm64-v18.6"},
		},
	}

	response := DockerHubTagsResponse{Results: []DockerTag{latest, versioned, older}}
	matching := response.FindTagsMatchingImages(&latest)
	names := make([]string, 0, len(matching))
	for _, tag := range matching {
		names = append(names, tag.Name)
	}

	if got, want := pickMostCompleteVersion(names), "18.7"; got != want {
		t.Fatalf("pickMostCompleteVersion(matching tags) = %q, want %q", got, want)
	}
}

func stringPointer(value string) *string {
	return &value
}
