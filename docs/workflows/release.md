# Release workflow

A release is anything versioned that leaves the repo: an app, a package, or the repo's own version.
The Release workflow (`.github/workflows/release.yml`) is the only path out, and it comes first in
this repo's automation (docs/FINDINGS.md). The done gate runs before anything publishes.

## How to cut a release

1. Run the done gate locally:
   ```sh
   npm ci
   npm run check
   ```
2. Tag and push:
   ```sh
   git tag v<version>
   git push origin v<version>
   ```
3. The Release workflow runs the same checks again (`verify` job), then creates the GitHub Release
   with generated notes (`release` job). The release is done when the run is green. Check it with
   `gh run list --workflow=release.yml --limit 1`.

The OKF template for this loop is `knowledge/templates/release.md`. Its `:version` parameter is the
version being released.

## The other release kinds

The workflow publishes a GitHub Release today. The extension points are in the workflow file:

- **App deploy** — add a `deploy` job with the target's CLI, gated on `needs: verify`.
- **npm package** — add a job with `npm publish --provenance`, gated on `needs: verify`.

Whichever kind, two rules stay (docs/FINDINGS.md):

- The proof command must fail when the work is broken. It runs in `verify`, before publishing.
- Nothing publishes without the human reading the diff that went into the tag.

## Versioning

`v<major>.<minor>.<patch>` tags. The generated release notes list the changes since the last tag;
edit the release after publishing if the notes need a human summary. Add a `CHANGELOG.md` entry in
the same change that bumps what is released.
