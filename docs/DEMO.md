# Walk through the synthetic sample

Start the sample using the [README](../README.md#try-the-synthetic-sample). It contains three geometric garment images and one outfit without an outfit image. None of the creator's clothes are included.

## What to look at

1. Open My outfits. The sample look links to the blue top and gray trousers. The full list keeps its saved order; season and style buttons only filter what you see.
2. Open My wardrobe. Select the blue top, inspect its details, and follow the link to its saved outfit. The brown jacket is not used by that look, so you can find it with “Not in any outfits.”
3. Open Wardrobe overview to see category and color counts, then try the four page colors in the header palette.
4. Open Outfit shuffle. An empty state is expected: the sample outfit has no outfit image. To show four-at-a-time batches and Shuffle again, add at least five illustrated outfits whose items are still active.

Ready to let go is available from My wardrobe. If you want to demonstrate a status change, look up the sample jacket's current code with `lookup-codes.mjs`, then use the [status command](MAINTENANCE.md#everyday-maintenance) against the sample server and data directory. Do not run demonstration commands against your real wardrobe.

The website does not upload photos or generate outfits on the page. Show any external chat and maintenance steps separately. Compare AI-prepared images with the real garments; an image cannot establish size, fabric, or fit.
