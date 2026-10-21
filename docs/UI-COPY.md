# English interface wording

This file is for contributors changing labels in the English edition. Display text may change, but garment codes, saved records, and category IDs must not. Shared page names, season labels, and count helpers live in `dist/ui-copy.js`.

## Names used in the app

| Label | What it refers to |
| --- | --- |
| My outfits | Saved combinations, shown in their saved order. |
| Outfit shuffle | Random batches of up to four saved looks with images; it does not create new looks. |
| My wardrobe | Active items recorded as owned. |
| Wardrobe overview | Category and recorded-color charts for active items. |
| Not in any outfits | An item with no links to saved outfits, not an item the user has never worn. |
| In 1–2 outfits | The number of saved outfit links, not actual wears. |
| Ready to let go | Set-aside items whose records remain available. |
| Planned outfit | A saved look with clearly marked pieces that are not yet owned. |

Use “item” for a general wardrobe record and a more specific word, such as “trousers,” when it improves clarity. Keep owned garments, suggested purchases, assumed basics, and AI-prepared images distinct. An image cannot verify size, fabric, or fit.

## Labels and messages

- Use sentence case for headings and controls. Keep brand names and user-written titles as they are.
- Name the action on a button: “View details,” “Shuffle again,” or “Try again.” Do not suggest that the website can upload photos, edit garments, or generate outfits.
- Use the shared count helper so singular and plural labels agree: “1 item,” “2 items,” “1 outfit,” “2 outfits.”
- Do not turn missing information into a conclusion. Use “Not confirmed” when a detail has not been checked.
- A failed read is an error state with a way to retry, not an empty wardrobe.
- Season and category labels may be translated; the stored IDs and matching rules stay the same.

## Icons and accessibility

The app uses the inline SVG icons in `dist/views/shared.js`. Navigation icons sit beside visible text. Decorative SVGs have `aria-hidden="true"` and `focusable="false"`; an icon-only button needs an accessible action name. The text alternative should name the action.

Use an arrow for navigation, expand corners for image enlargement, and an external-link icon only when a link actually opens a new tab. The set-aside view must not use wording or an icon that implies permanent deletion.

`tests/public/english-ui.test.mjs` checks terminology, counts, icon semantics, loading and error states, and item details. After changing a page, also inspect the rendered interface, keyboard focus, dialogs, and garment-to-outfit links.
