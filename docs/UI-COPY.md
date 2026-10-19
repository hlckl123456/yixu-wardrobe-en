# English interface copy and icons

Keep display wording separate from SQLite keys, garment codes and canonical category IDs. Shared page names, season labels and plural counts live in `dist/ui-copy.js`.

## Terminology

| Label | Meaning |
| --- | --- |
| My wardrobe | Items the user plans to keep wearing. |
| Tops | Shirts, T-shirts, sweaters and other tops; not just thermal base layers. |
| My outfits | Saved combinations of wardrobe items. |
| Not in any outfits | No links to saved outfits; not a record of actual wears. |
| Ready to let go | Items set aside, with records retained and restoration possible. |
| Style inspiration | Ideas to explore, not verified wardrobe inventory. |

Use “item” for a general wardrobe record. Use garment-specific words when they help, such as shirt, trousers or shoes. Keep owned items, AI-prepared images and unverified basic layers clearly distinct.

## Wording

- Use sentence case for interface headings, labels and actions, following the [Microsoft style guide](https://learn.microsoft.com/en-us/style-guide/text-formatting/using-type/use-sentence-style-capitalization). Preserve brand names and user-authored titles.
- Name the action, such as “View details” or “Try again”, following [GOV.UK button guidance](https://design-system.service.gov.uk/components/button/). Do not imply web upload, in-page editing, automatic purchases or a built-in image generator.
- Use the shared count helper: “1 item”, “2 items”, “1 outfit”, “2 outfits”. Do not assemble nouns independently in each view.
- Distinguish missing information from a confirmed mismatch. Say “Not confirmed” without guessing size, material, warmth or hidden construction.
- Keep error messages short, explain the next step and retain retry controls. Never present a failed read as an empty wardrobe.
- Display season labels consistently from canonical IDs. Label changes must not reclassify saved outfits or reference records.
- Keep photo provenance and fit limitations visible. AI previews compare ideas; they do not establish real fit.

## Icons

Use the inline SVG set in `dist/views/shared.js`. Icons share a 24 × 24 view box, rounded strokes and no runtime icon dependency.

| Action | Icon |
| --- | --- |
| Go to another view in the app | Right arrow |
| Go back | Left arrow before the label |
| Enlarge an image in a dialog | Expand corners |
| Open a link in a new tab | External-link icon plus an accessible new-tab hint |
| Jump down to wardrobe matches | Down chevron |
| Close a dialog | X icon with a specific accessible name |

Keep visible text beside navigation icons. Decorative SVGs use `aria-hidden="true"` and `focusable="false"`; icon-only buttons need a clear accessible name. The text alternative describes the action rather than the drawing, following [W3C guidance on functional images](https://www.w3.org/WAI/tutorials/images/functional/).

Use a hanger for the wardrobe, a lookbook icon for outfits, a picture icon for inspiration, and a chart for the overview. The trash-can icon labels the set-aside collection; it must not become a permanent-delete action.

## Checks

`tests/public/english-ui.test.mjs` covers terminology, plural counts, icon semantics, loading and error states, relevant item-detail fields and unchanged input records. Also check rendered desktop and narrow layouts, keyboard focus, dialog dismissal, image enlargement and garment-to-outfit links before shipping UI changes.
