#!/usr/bin/env /bin/bash

../mylife-tools-build/node_modules/.bin/tsc --project public/tsconfig.json && \
../mylife-tools-build/node_modules/.bin/vite --config ../mylife-tools-build/ui/vite.config.ts build
