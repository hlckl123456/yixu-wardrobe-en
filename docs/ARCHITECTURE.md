# Architecture

Yixu runs on your computer. The browser reads garments, outfits, and registered images from a service on `127.0.0.1`. The database and images remain in the directory selected by `YIXU_DATA_DIR`. Browser pages have no write controls; maintenance commands submit changes through the same local service.

## Source of truth

| Data | SQLite tables | Rule |
| --- | --- | --- |
| Garments and codes | `garments`, `identities` | Availability is separate from ownership; removed codes stay reserved. |
| Outfits and codes | `outfits`, `identities` | Descriptive fields and saved order are kept with the outfit record. |
| Owned items in an outfit | `outfit_items` | Foreign keys point to real garments; a look cannot duplicate a slot or garment. |
| Outfit origins | `outfit_sources` | Historical derivation survives removal of a parent outfit. |
| Images and versions | `garment_versions`, `outfit_visuals`, `media_assets` | Relative paths and SHA-256 hashes are registered; image bytes are not overwritten. |
| Notes and older material | `notes`, `documents`, `formula_preferences` | Historical material and preferences remain, although the old inspiration UI is retired. |
| Operation receipts | `commands`, `imports` | Used to detect repeated requests and completed imports. |

`wardrobe.sqlite` is the only writable record of inventory, saved outfits, and their relationships. Resources such as `catalog.json` returned to the browser are database projections, not a second catalog to maintain.

A planned look is explicitly marked `outfitKind: "planned"`. Its `suggestedPieces` describe unpurchased concepts without creating garment IDs or `outfit_items` rows. Pieces the user actually owns still receive normal `outfit_items` links. An ordinary owned outfit cannot present a shopping concept as inventory.

## Writes and media

Maintenance tools read the current record, then submit a command with the expected previous value to the local service. The service validates the command and relationships before committing one SQLite transaction. Foreign keys are enabled, issued codes are never reused, and editing an outfit does not move its saved position.

Image files are staged before they are registered by hash. An outfit or garment can only reference a registered, available image. The server serves exact registered URLs and checks path containment and file hashes. Retiring an image revokes its served URL while keeping private recovery history. A SQLite transaction cannot roll back filesystem writes, so a failed intake may leave an unregistered file; the application does not delete it automatically.

A database snapshot is retained before a data write. A portable backup also copies registered images; a SQLite snapshot alone is not a [complete backup](MAINTENANCE.md#back-up-and-restore).

## Browser views

My outfits reads the full saved list and keeps its order. Season and style controls only filter the current view. Outfit shuffle starts with saved, illustrated, ordinary outfits whose owned items are still active, then applies the selected mood and season. Each filter scope keeps a shuffled queue for the current session, prioritizing unseen looks and restoring the current batch when you return to a scope. It does not generate, save, or reorder outfits.

My wardrobe derives categories and saved-outfit usage from garments and SQL relationships. Wardrobe overview computes category and color charts from active items without storing a separate analysis. Ready to let go is a garment-status view; setting that status does not physically discard anything. The four color themes store only a theme identifier in browser storage, not in the wardrobe database. If storage is blocked, switching themes still works for the current page.

The browser reads through the local API and shows an error if a read fails rather than showing a false empty wardrobe. Older browser storage is a migration source only; migration preserves its original bytes. Old inspiration and analysis links redirect into current views while historical source identifiers stay available for validating older records.

## Tests and publication

Tests use temporary databases and synthetic images. The public source export contains allowlisted code and documentation, not private photos, databases, candidate pages, or old Git history. The service is designed for one local user; it has no accounts, multi-user permissions, automatic sync, or built-in AI service.
