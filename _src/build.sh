#!/bin/sh
# Re-minify after editing sources in _src/ (run from the site root: sh _src/build.sh). Requires Node.
cd "$(dirname "$0")/.." || exit 1
for f in $(cd _src && find assets projects -name '*.css' -o -name '*.js'); do
  npx --yes esbuild "_src/$f" --minify --outfile="$f" --allow-overwrite --log-level=error
done
