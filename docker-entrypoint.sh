#!/bin/sh
set -e

node -e 'process.stdout.write(`window.API_ROOT = ${JSON.stringify(process.env.API_ROOT ?? "")};\n`)' > dist/config.js

exec "$@"
