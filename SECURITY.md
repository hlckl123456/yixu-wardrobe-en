# Security and privacy

Yixu is built for one person on one computer. The server binds to `127.0.0.1` and checks request hosts and origins. Browser pages are read-only, while maintenance commands can change local data. These checks are not account authentication; the project has no access control for public hosting.

Do not expose the local service through a public proxy or let untrusted programs call its maintenance API. Back up your wardrobe before running unfamiliar scripts.

Garment photos, databases, and backups belong in `private-data/` or another private data directory, outside Git tracking. A public repository should not contain real wardrobes, candidate pages, conversations, or credentials. `.gitignore` only prevents future accidental adds; it cannot remove files from earlier commits. If you publish a private development project, start a new public history from an audited source export.

A database snapshot contains only database data. Use `scripts/backup-private.mjs` to include registered images, and restore to a new directory so later edits are not overwritten. See the [maintenance guide](docs/MAINTENANCE.md#back-up-and-restore).

For public issues, use synthetic records and a minimal reproduction. Do not upload real wardrobe data, photos, databases, or credentials.
