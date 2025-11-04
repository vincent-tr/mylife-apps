package common

import (
	"fmt"

	"golang.org/x/net/html"
)

func FindAttribute(node *html.Node, attr string) (string, error) {
	for _, n := range node.Attr {
		if n.Key == attr {
			return n.Val, nil
		}
	}
	return "", fmt.Errorf("attribute '%s' not found", attr)
}

func HasAttribute(node *html.Node, attr string) bool {
	for _, n := range node.Attr {
		if n.Key == attr {
			return true
		}
	}

	return false
}
