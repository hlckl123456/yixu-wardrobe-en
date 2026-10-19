# Yixu · English Wardrobe

A wardrobe app that runs on your own computer. Keep a record of your clothes, save outfits you would wear, and see which pieces have not made it into your saved looks.

**[中文版 → yixu-wardrobe-zh](https://github.com/hlckl123456/yixu-wardrobe-zh)**

## What it does

- Browse garments by category and use in saved outfits.
- Keep outfit images and styling notes, and find saved outfits from a garment's detail panel.
- Move pieces to Ready to Let Go without losing their records, and restore them later.
- Store garments, outfits and their relationships in SQLite, with local images checked for integrity.

The website is a browser for your wardrobe. Photo preparation, outfit generation and intake happen through your chosen external chat or AI tools and this project's maintenance commands. This version has no web upload button, built-in model API, automatic background removal or one-click outfit generator.

## Run

Use Node.js 24 or later. No runtime npm dependencies need to be installed.

```sh
git clone https://github.com/hlckl123456/yixu-wardrobe-en.git
cd yixu-wardrobe-en
npm start
```

Open http://127.0.0.1:4184/#outfits. A fresh installation starts with an empty wardrobe.

```sh
npm run status
npm stop
```

On macOS, you can also double-click `Start Wardrobe.command` and `Stop Wardrobe.command`. Set `YIXU_NODE_BIN` to a runtime path if the launcher cannot find Node.

## Try a sample first

The sample contains geometric images and fictional records, not photos or real garments. The `demo-data` directory must not already exist.

```sh
npm run demo -- "$PWD/demo-data"
YIXU_DATA_DIR="$PWD/demo-data" node scripts/local.mjs start 4194
```

Open http://127.0.0.1:4194/#outfits. The sample contains three synthetic garments and one outfit. Open a garment detail panel, then follow its linked outfit.

Stop the sample server:

```sh
YIXU_DATA_DIR="$PWD/demo-data" node scripts/local.mjs stop 4194
```

These commands use macOS/Linux shell syntax. On Windows, set `$env:YIXU_DATA_DIR` in PowerShell before running the same `node` commands.

## Add your own clothes

1. Photograph your clothes and remove the background using a tool of your choice. Review and document any AI reconstruction of hidden areas.
2. Prepare a reviewed intake manifest and run `scripts/intake.mjs`, following the [maintenance guide](docs/MAINTENANCE.md).
3. Save confirmed looks with `scripts/save-owned-outfit.mjs`. Outfits reference real garment records; reference pictures are not inventory.

Not Used and Used in 1–2 Outfits count saved outfit links, not actual wears. A low count is a reason to review a piece, not a decision to discard it.

## Data and privacy

Data defaults to `private-data/` inside this checkout, which Git ignores. Set an absolute `YIXU_DATA_DIR` to use another location.

This repository contains code, documentation and synthetic test utilities only. The developer's garment photos, outfit images, database, conversations, private candidate pages and old Git history are not included.

The server listens on `127.0.0.1` only. It is a single-user local app without accounts or multi-user authorization. Do not expose it directly to the internet or commit databases and backups. See [security boundaries](SECURITY.md).

The Chinese and English repositories run independently. Their data does not sync automatically.

## Develop

```sh
npm test
npm run check
```

Tests use temporary databases and synthetic images, not your wardrobe. No build step is required. The frontend uses native JavaScript modules; the backend uses Node's built-in SQLite support.

- [Architecture and relationships](docs/ARCHITECTURE.md)
- [Intake, backups and restoration](docs/MAINTENANCE.md)
- [Demo walkthrough](docs/DEMO.md)

The optional thumbnail script requires a separately installed `sharp`. Normal browsing and tests do not.

An optional [GitHub Actions test template](docs/ci-workflow.yml.example) is included. Copy it to `.github/workflows/test.yml` to enable it, using credentials authorized to upload workflows. It is not enabled in this repository.

## License

This project uses the [MIT License](LICENSE). The developer's private data and photographs are not part of this distribution.
