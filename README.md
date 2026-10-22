# Yixu

**See what is already in your wardrobe before deciding what to wear.**

I built Yixu because I kept wearing the same few pieces while forgetting what else I owned. I photographed my clothes, used Codex to explore outfit ideas, and kept only the looks I would actually wear. Yixu keeps those reviewed items and outfits together, so I can find them again when I need them.

This repository is the runnable **English source edition**. The [Chinese edition](https://github.com/hlckl123456/yixu-wardrobe-zh) is available separately. A fresh download starts with an empty wardrobe; neither edition includes my photos, outfits, or private records.

## What you can do

| Page | What it shows |
| --- | --- |
| My wardrobe | Browse the items you have added, open an item to find its outfits, filter by saved-outfit usage, and view category and color charts. |
| My outfits | Browse the looks you chose to save, in their saved order. Filter by season and style. |
| Outfit shuffle | Pick a season and mood, then see up to four eligible saved looks at a time. Shuffle again for another random batch; unseen looks take priority within a round. |

The palette in the top right switches between sand, rose, blue, and sage. Items marked “Ready to let go” remain available in a secondary wardrobe view; changing their status does not erase their records.

Yixu browses **outfits you have already saved**. “Shuffle again” does not call an AI model or generate new looks. You can use Codex or another tool to prepare photos and explore ideas outside the website, then decide what to save.

## Try the synthetic sample

You need Node.js 24 or later. Normal use has no additional npm runtime dependencies. This sample contains three geometric garment images and one outfit without an outfit image. It includes none of my private data.

```sh
git clone https://github.com/hlckl123456/yixu-wardrobe-en.git
cd yixu-wardrobe-en
npm run demo -- "$PWD/demo-data"
YIXU_DATA_DIR="$PWD/demo-data" node scripts/local.mjs start 4194
```

Open the [synthetic sample](http://127.0.0.1:4194/#outfits) to explore item-to-outfit links, Wardrobe overview, and the palette. Outfit shuffle will show its empty state because the sample look has no image. To see four-look batches, you first need to save illustrated outfits. The [demo walkthrough](docs/DEMO.md) suggests what to inspect.

When you are finished:

```sh
YIXU_DATA_DIR="$PWD/demo-data" node scripts/local.mjs stop 4194
```

`demo-data/` is ignored by Git. Use a new, nonexistent directory for the sample; the command will not overwrite an existing wardrobe.

The environment-variable syntax above is for macOS and Linux. In Windows PowerShell, set `$env:YIXU_DATA_DIR = "$PWD/demo-data"` before running the same `node scripts/local.mjs` commands.

## Start your own wardrobe

To start with an empty wardrobe, run:

```sh
npm start
```

Open [your local wardrobe](http://127.0.0.1:4184/#outfits). The server listens only on `127.0.0.1`. Use `npm run status` to check it and `npm stop` to stop it; stopping keeps your data. On macOS, you can also double-click `Start Wardrobe.command` and `Stop Wardrobe.command`. If the launcher cannot find Node, set `YIXU_NODE_BIN` to your Node executable.

The website is for browsing. To add your own clothes, use the maintenance commands rather than an upload or edit button:

1. Prepare a photo or a product image that matches an item you own, make a cutout, and compare the result with the original. Review and record any AI reconstruction of hidden areas.
2. Prepare item details using the [maintenance guide](docs/MAINTENANCE.md#add-a-garment), then add them with `scripts/intake.mjs`.
3. Make outfit candidates using items you own. Review the images and save the looks you want with `scripts/save-owned-outfit.mjs`.

Saved looks appear in My outfits. Only ordinary looks with an image and currently active items appear in Outfit shuffle. You can also save a planned outfit with clearly marked pieces you do not own yet; those pieces do not become wardrobe inventory.

## Start with product images instead of photographing everything

Photographing every garment can make it hard to get started. If you have product images that match your clothes, you can use those instead.

The planned workflow is to authorize an external AI tool to organize shopping emails or Taobao orders, collect images of the matching styles and colors, and add items after your review. Backfill older purchases in one batch, then use Automation to periodically prepare a review queue for new purchases.

The repository currently accepts prepared images through its intake commands. Email and Taobao connections, and scheduled imports, are not built in yet. Collection requires a separately configured external tool with authorized access to the source. Review returns, cancellations, and duplicate purchases, and confirm you still own each item before adding it.

## Where your data stays

By default, data lives in `private-data/` inside this checkout, which Git ignores. Set `YIXU_DATA_DIR` to a different absolute path if you prefer. Keep the database, photos, and backups on your computer and out of GitHub.

This is a single-person local app. It has no accounts, multi-user permissions, or access controls for public hosting. The Chinese and English repositories use separate data directories and do not sync automatically. See the [security notes](SECURITY.md). “Not in any outfits” and “In 1–2 outfits” count links to saved looks, not real-world wears.

## More information

- [Wardrobe intake and AI collaboration](docs/AGENT-WORKFLOW.md) covers image preparation, outfit review, common recognition errors, and a new-chat handover template.
- [Demo walkthrough](docs/DEMO.md) suggests a route through the synthetic sample.
- [Maintenance guide](docs/MAINTENANCE.md) covers adding and changing records, backup, and restore.
- [Architecture](docs/ARCHITECTURE.md) explains storage, images, and outfit relationships.
- [English interface copy](docs/UI-COPY.md) records the wording used in this edition.

After changing the source, run `npm test` and `npm run check`. Tests use temporary databases and synthetic images. The code is under the [MIT License](LICENSE); my private photos and wardrobe data are not in this repository.
