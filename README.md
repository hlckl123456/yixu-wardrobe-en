# Yixu

Yixu helps you browse clothes you actually own and the outfits you have saved with them. Your garment photos and outfit records stay on your computer. Open an outfit to see which wardrobe items it uses.

This is the runnable source edition. A fresh download starts with an empty wardrobe and contains none of the creator's personal photos or outfits. [中文版](https://github.com/hlckl123456/yixu-wardrobe-zh).

## What you can do

- **My outfits** shows saved looks in their saved order. Season and style filters are one click away, and each look links back to its wardrobe items.
- **Outfit shuffle** draws up to four looks from saved outfits that have an image and use currently active items. Choose a mood and season, then shuffle again. Looks you have not seen in the current round come first.
- **My wardrobe** lets you browse by category, subtype, or number of saved outfit links. Open an item to find its outfits, or open Wardrobe overview for category and color charts. Ready to let go is a secondary wardrobe view; those records remain available.
- **Color palette** switches the page between sand, rose, blue, and sage.

You can also save a planned outfit with clearly labeled pieces you do not own yet. Those pieces never become wardrobe inventory.

## Run it locally

You need Node.js 24 or later. Normal use has no additional npm runtime dependencies.

```sh
git clone https://github.com/hlckl123456/yixu-wardrobe-en.git
cd yixu-wardrobe-en
npm start
```

Open [http://127.0.0.1:4184/#outfits](http://127.0.0.1:4184/#outfits). Use `npm run status` to check the server and `npm stop` to stop it. Stopping the server does not delete your wardrobe.

On macOS, you can also double-click `Start Wardrobe.command` and `Stop Wardrobe.command`. If the launcher cannot find Node, set `YIXU_NODE_BIN` to your Node executable.

## Try the synthetic sample

The sample has three geometric garment images and one outfit without an outfit image. It is useful for checking item details, outfit links, and Wardrobe overview. It will not appear in Outfit shuffle because that view requires illustrated outfits. Choose a directory that does not already exist.

```sh
npm run demo -- "$PWD/demo-data"
YIXU_DATA_DIR="$PWD/demo-data" node scripts/local.mjs start 4194
```

Open [http://127.0.0.1:4194/#outfits](http://127.0.0.1:4194/#outfits). When you are done:

```sh
YIXU_DATA_DIR="$PWD/demo-data" node scripts/local.mjs stop 4194
```

The environment-variable syntax above is for macOS and Linux. In PowerShell, set `$env:YIXU_DATA_DIR` before running the same Node commands. The [demo walkthrough](docs/DEMO.md) suggests what to inspect.

## Add your own clothes

The website is for browsing. Photo upload and editing happen outside the page, through tools you choose and the maintenance commands in this repository.

1. Photograph an item, prepare its cutout, and compare the result with the original. Review and record any AI reconstruction of hidden areas.
2. Prepare its metadata using the [maintenance guide](docs/MAINTENANCE.md), then add it with `scripts/intake.mjs`.
3. Make and review an outfit using your existing items, then save it with `scripts/save-owned-outfit.mjs`.

You can discuss outfit ideas in Codex or another external tool. This repository has no built-in model call, and Shuffle again does not create new outfits. “Not in any outfits” and “In 1–2 outfits” count links to saved looks, not real-world wears.

## Where your data lives

By default, data is stored in `private-data/` inside this checkout, which Git ignores. Set `YIXU_DATA_DIR` to an absolute path if you want another location. Keep databases, images, and backups out of GitHub.

The server binds only to `127.0.0.1`. It is built for one person on one computer, with no accounts or public-hosting access control. The Chinese and English repositories have separate data directories and do not sync automatically. See the [security notes](SECURITY.md).

## More information

- [Demo walkthrough](docs/DEMO.md) shows the pages using synthetic data.
- [Maintenance guide](docs/MAINTENANCE.md) covers intake, updates, checks, backup, and restore.
- [Architecture](docs/ARCHITECTURE.md) explains storage, outfit relationships, and browser reads.
- [English interface copy](docs/UI-COPY.md) records the wording used in this edition.

For development, run `npm test` and `npm run check`. Tests use temporary databases and synthetic images. The project uses the [MIT License](LICENSE); the creator's private photos and data are not included.
