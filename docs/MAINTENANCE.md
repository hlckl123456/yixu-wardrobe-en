# Maintain your wardrobe data

The website is for browsing. Intake, outfit saves, and status changes go through command-line tools that write to the same local SQLite database as the running service. Before changing anything, confirm which data directory and port the tools will use.

## Check the service and data directory

`npm start` launches the default service at [http://127.0.0.1:4184](http://127.0.0.1:4184). Use `npm run status` to check it and `npm stop` to stop it. You need Node.js 24 or later. Normal use has no additional npm runtime dependencies; the optional thumbnail script separately requires `sharp`.

Data defaults to `private-data/` in this checkout. To use another location, set `YIXU_DATA_DIR` to an absolute path and use the same value for the service and any command that stages images. If the service uses a different port, also set `YIXU_ORIGIN`, for example `http://127.0.0.1:4194`. Do not let a maintenance command point at a different running wardrobe.

`wardrobe.sqlite` is the database. Images live under `public/` in the data directory, but the server only serves exact URLs registered in SQLite. Catalog JSON returned to the browser is a read-only projection, not another file to edit.

## Add a garment

Keep the original photograph, make a transparent PNG cutout, and compare the two before intake. Prepare a JSON manifest containing at least:

- `collection: "owned"`, `name`, `layer`, `subtype`, `fit`, and `pattern`.
- `color` with `name`, `family`, and a six-digit hexadecimal `hex` value.
- Arrays for `styles`, `seasons`, and `uncertainties`.
- `originalPath` and `cutoutPath`, a `processingMethod`, and an approval record such as `review: { "approved": true, "notes": "..." }`.

The original may be PNG or JPEG. The cutout must be a non-interlaced RGBA PNG with a transparent background. `processingMethod` can be `background-extraction`, `segmentation`, or `ai-reconstruction`. If AI reconstructs an area hidden in the source photo, the review must explicitly authorize that work and record any confirmed details. Use distinct `sourceItemKey` values when one source photo contains multiple garments.

With the matching local service running, use:

```sh
node scripts/intake.mjs /absolute/path/reviewed-item.json
```

The command checks the manifest, images, and previous source hashes before assigning a stable code and registering the item. Reusing a source returns the existing record instead of quietly creating a duplicate.

## Everyday maintenance

| Task | Command | Result |
| --- | --- | --- |
| Confirm item or outfit codes | `node scripts/lookup-codes.mjs SY01 DP01` | Reads current records only. |
| Set an item aside | `node scripts/set-garment-status.mjs pending-discard SY01` | Keeps its record; use `active` to make it available again. |
| Register an outfit image | `node scripts/register-media.mjs /absolute/reviewed.png assets/outfits/look-v1.png` | Registers immutable media before an outfit refers to it. |
| Save a reviewed look | `node scripts/save-owned-outfit.mjs /absolute/look.json` | Checks item codes, image registration, and the current record before saving. |
| Remove a specific look | `node scripts/remove-owned-outfits.mjs DP01` | Removes that look while keeping garment records and reserved codes. |
| Check private data | `node scripts/check.mjs --data-dir /absolute/private-directory` | Checks database relationships, registered hashes, and current cutouts. |

For an owned outfit, `selection` refers to garments already in the wardrobe. An explicitly planned look with `outfitKind: "planned"` may contain validated `suggestedPieces`. Those unpurchased pieces stay in the look and do not become inventory.

Removing garments, restoring deleted records, retiring old images, and replacing garment images require exact prior records and an explicit impact set. These operations check the expected state and preserve historical codes and image versions. A database snapshot is made before a write. Media files are outside SQLite transactions, so a failed intake can leave an unregistered file that needs separate review.

## Back up and restore

A portable backup copies a consistent SQLite database and every registered image, then verifies their hashes. Use a new absolute destination:

```sh
node scripts/backup-private.mjs /absolute/new/backup-directory
```

Restoration also writes to a new directory and leaves the current wardrobe untouched:

```sh
node scripts/restore-private.mjs /absolute/backup-directory /absolute/new/restored-directory
```

Inspect the restored copy, stop the current service, and point `YIXU_DATA_DIR` to the new directory. Keep the old directory until you have accounted for edits made after the backup. Back up processing originals and unregistered files separately with your usual file-backup tool.

For a one-time move from an older private v1 checkout, stop writes and retain the old checkout and a consistent database backup before using `scripts/migrate-private-data.mjs` with a new destination. Do not reopen a migrated v2 database in the v1 program.

## Develop and publish

`npm test` uses temporary databases and synthetic images. `npm run check` checks application source only; pass `--data-dir` as shown above to check a real data directory. See [Architecture](ARCHITECTURE.md) for the data model.

For a public source release, `node scripts/export-source.mjs /absolute/new/source-export` copies only allowlisted source files. Audit the output before publishing. Do not publish the Git history of a private development checkout; deleted files may still be present in old commits.
