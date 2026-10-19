# Security boundaries

This is a single-user local application. The server binds to `127.0.0.1` and checks Host and request origins. Browser pages are read-only; maintenance commands can change local data.

There are no accounts, user authentication, multi-user permissions or public-hosting configuration. Same-origin checks are not login authentication. Do not bind the service to a public interface, expose it through a public proxy or give untrusted programs access to its maintenance API.

Install code and maintenance tools from trusted sources. Back up local data before running unfamiliar scripts.

Never commit `private-data/`, sample runtime directories, SQLite files, backups, photos, secrets or conversations. A `.gitignore` cannot remove files from earlier commits. Export and audit source into a fresh repository before publishing a private development project.

SQLite snapshots are not a full media backup. Use `backup-private.mjs` for the database and registered images. Restore into a new directory instead of overwriting later edits.

Do not attach real wardrobes, databases, photos or credentials to public issues. Report problems with synthetic records and a minimal reproduction.
