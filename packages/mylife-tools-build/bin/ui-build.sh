#!/usr/bin/env /bin/bash

../../node_modules/.bin/tsc --project public/tsconfig.json && \
../../node_modules/.bin/vite --config ../mylife-tools-build/ui/vite.config.ts build
