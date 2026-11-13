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

func TestPickMostCompleteVersionAcceptsStableSuffix(t *testing.T) {
	tags := []string{"latest", "2.0-stable", "2.0.2-stable", "2.1.4-beta"}

	if got, want := pickMostCompleteVersion(tags), "2.0.2-stable"; got != want {
		t.Fatalf("pickMostCompleteVersion(%v) = %q, want %q", tags, got, want)
	}
}

func TestPickMostCompleteVersionRejectsInvalidStableSuffix(t *testing.T) {
	for _, tag := range []string{"stable", "stable-2.0.2", "2.0-stable.2"} {
		if got := pickMostCompleteVersion([]string{tag}); got != "" {
			t.Errorf("pickMostCompleteVersion(%q) = %q, want empty", tag, got)
		}
	}
}

func stringPointer(value string) *string {
	return &value
}
