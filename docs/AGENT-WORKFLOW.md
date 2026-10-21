# Wardrobe intake and AI collaboration

This guide describes a reviewed workflow from garment photos to saved outfits, for people maintaining a wardrobe with an AI agent. It contains no personal photos, inventory, measurements, purchase records, or preferences.

The website is for browsing. Photo preparation, outfit exploration, and data maintenance happen through external tools and local maintenance commands. The checks below are work to perform, not built-in automatic processing or review features.

## Confirm the project first

Read `AGENTS.md`, the [maintenance guide](MAINTENANCE.md), and the [architecture notes](ARCHITECTURE.md). Confirm the project root, data directory, local port, and current database. Use Node.js 24 or later with SQLite support; check the runtime version first if `node:sqlite` is missing.

For another person's wardrobe, start from source and an empty database. Reuse the interface and working methods, while establishing that person's inventory, measurements, preferences, purchase decisions, and reconstruction permissions separately. Do not seed a new wardrobe with another person's data or taste.

Keep the server on loopback. A local-port permission error is not evidence of database damage; do not work around it by exposing the service to a network. Tests use temporary directories and databases.

## When a batch of photos arrives

1. Inspect every original and identify the intended item and its ownership. Background products, alternate colors, and clothes worn by a model are not automatically owned. Clarify only genuine ambiguities.
2. Agree on original retention first. Optional folders include `private-data/inbox/originals/` for originals and `private-data/staging/` for processed images; create them if you use this convention. Never move or delete source files outside the project.
3. Record sources and hashes, then check the current inventory for duplicates. A new photo of an existing garment keeps its identity. Use a stable `sourceItemKey` for distinct items from one photo, never a fabricated hash to bypass deduplication.
4. Keep originals and processed versions separate. Check color, texture, logos, prints, collars, sleeves, fastenings, hems, lengths, and the front and rear shoe structure.
5. Distinguish background removal from generative reconstruction. Completing hidden areas needs explicit permission and an accurate `processingMethod` and review record. Do not silently redesign or recolor an item to make an image look complete.
6. Inspect every result visually. Show source/result comparisons when reconstruction, color shifts, alpha edges, lettering, or structure need review. A successful tool call is not an image-quality check.
7. Preserve the exact approved image bytes. Prepare the record using the [intake instructions](MAINTENANCE.md#add-a-garment) and run `scripts/intake.mjs`. Verify the database, registered assets, files, and page before reporting success.
8. Give a short batch receipt with counts, stable codes, names or thumbnails, duplicates, and unresolved details.

## Details that are easy to misread

- A layered-looking top may be one inseparable garment. Visible collar or hem layers do not prove that two independent pieces exist.
- Distinguish a closed heel counter, backless design, platform sole, and raised heel. Informal descriptions can be ambiguous; use side and rear photos to confirm structure.
- A hanger's branding does not establish the garment's brand. A product screenshot does not establish ownership of every color shown.
- Photos cannot verify exact dimensions, fabric composition, authenticity, filling, warmth, or personal fit. Keep unknown fields unknown.
- Label AI-prepared images and outfit illustrations accurately. They are not evidence of a personal fitting or exact construction.

When someone corrects an item's structure or color, verify its current record and follow actual relationships to affected saved looks and candidate pages. Change only the affected content, retaining earlier versions and unrelated approved images.

## Make and review outfit candidates

1. Start from currently active, genuinely owned items and their latest reviewed images. Keep owned, planned, reference, removed, and set-aside items distinct.
2. Use exact garment references and record real IDs, image versions, and wearing methods. Do not invent clothes, silently recolor them, or assume a basic item is owned. Any permitted assumption must be explicit and must not become inventory.
3. Review formality, silhouette, volume, length, color, footwear, and layering together. Trousers that fail in one look are not necessarily disliked in every combination.
4. Preserve the parts the user likes, then propose a targeted change to color, shape, or proportions. Learn taste from the current person's feedback.
5. Offer genuinely different clothing combinations. Changes to shoes, accessories, poses, or wearing methods should not inflate the number of new looks. Compare the main upper garments and bottoms against the batch and historical candidates.
6. Keep complete garments and both shoes visible. Check collars, prints, waistbands, hems, heel structure, and the selected wearing method; record remaining image uncertainties.
7. Stable `HX` candidate codes and a shared review page can support selection. See `dist/reviews/candidate-review.js` for an implementation reference. Private pages and media still follow the asset-registration rules.

A candidate page does not automatically become My outfits. After explicit selection, preserve the reviewed image bytes and save through `scripts/save-owned-outfit.mjs`; do not regenerate the image during intake. Keep the user's selection order, deduplicate repeated codes, and resolve speech ambiguities against the current candidate range.

Unselected, held, or “look again” candidates are not approved. Execute an explicit removal request using exact codes. Proposed replacements remain candidates until selected again. Do not reorder other records or revive previously deleted looks.

## Understand the current website

- The primary pages are My outfits, Outfit shuffle, and My wardrobe, designed around desktop browsing and clear garment images.
- My outfits keeps saved order. Season and style controls only filter the visible results.
- Outfit shuffle randomly draws up to four eligible saved looks for the selected season and mood, including the first batch. Unseen looks take priority within a round. It neither calls a model nor silently widens an empty filter.
- The header palette switches among four page colors. Wardrobe overview and Ready to let go are secondary wardrobe views.
- “Not in any outfits” and “In 1–2 outfits” count saved-outfit links, not real-world wears, and do not justify discarding an item.

## Maintain records and media

Stable codes are communication aliases; internal IDs own the relationships. `WT`, `SY`, `KZ`, `XZ`, `PS`, and `DP` identify outerwear, tops, bottoms, shoes, accessories, and saved outfits. Resolve exact codes in the current database before a change. Never infer them from a title or list position, or reuse them after removal.

SQLite is the only writable record. `outfit_items` owns garment membership and `outfit_sources` owns derivation. Do not infer links from titles or page arrays, or introduce a second writable JSON inventory.

Ordinary changes go through the local service. Verify exact records and impact first. Cancelling a purchase, setting an item aside, and deleting it are different operations. `pending-discard` retains ownership and history but excludes the item from new ordinary outfits.

Save image revisions at new paths with registered hashes and provenance; never overwrite reviewed bytes. Asset registration, record saving, and integrity verification are separate steps that must agree. A file on disk alone does not mean intake succeeded.

A complete backup needs a consistent database and its registered images. Verify restoration in a new directory before switching. A database snapshot is not a full image backup. Publish source through an explicit file allowlist, excluding personal photos, databases, receipts, and old Git history.

## Hand off to a new chat

A new chat does not automatically inherit an earlier chat's complete history. Maintain reusable methods, environment details, and personal records separately. New explicit corrections override older information. Keep personal records in private storage or this project's `documents.preferences.workflowHistory`, maintained through service commands.

Use the following template in a private handover file. Do not commit filled-in personal paths, information, or receipts to a public repository.

```text
Project root: <project-root>
Data directory: <private-data-directory>
Local origin: <loopback-origin>
Current state: <completed, awaiting review, failed, and unresolved batches>
Read first: AGENTS.md, maintenance docs, this project's private work history
Confirmed permissions: <processing scope, reconstruction, selections, removals>
Current preferences: <this person's explicit feedback and its source>
Continue with: <next photos or candidates, plus acceptance criteria>
```

Have the receiving agent read the rules and verify project, database, and service identity before continuing from the unfinished step. Do not initialize the database again, regenerate approved images, or reassign existing codes.
