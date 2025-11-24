.PHONY: all-ui all-server

APPS := mylife-energy mylife-idly mylife-money mylife-monitor mylife-portal

define foreach-apps
    @for module in $(APPS); do \
        echo "==> $$module: $(1)"; \
        $(MAKE) -C $$module $(1) || exit 1; \
    done
endef

all-ui:
	$(call foreach-apps,ui-build)

all-server:
	$(call foreach-apps,server-build)
