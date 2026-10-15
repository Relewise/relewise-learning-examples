# Catalog image provenance

All 274 sample products now reference one generated placeholder:
[`template/assets/product-placeholder.png`](../template/assets/product-placeholder.png).
It is included in the repository and the npm template. The catalog uses its raw
GitHub URL on `main`, which requires the asset to be merged and the repository
to be public before it can be loaded externally.

The placeholder was generated on October 15, 2026 with OpenAI's built-in image
generation tool, without reference images. It depicts an unbranded gray box and
is supplied under the repository's MIT license.

Generation prompt:

> Generate one square product catalog placeholder: a single plain unbranded light-gray cardboard box, centered on a white background with a soft studio shadow. Clean, understated 3D illustration with generous whitespace. No text, logos, trademarks, recognizable products, or decorative elements. Intended as the same neutral placeholder for every product in a programming tutorial.

## Previous catalog images

Earlier versions referenced 274 externally hosted product images from the
`relewisedemodata` Cloudinary account. The catalog was introduced in commit
`1f10ea9` on July 31, 2025 without image source or permission records. Searches
of repository history, the internal knowledgebase, and indexed Slack messages
did not establish reuse permissions.

The current catalog no longer references those images. Their URLs remain in
older Git commits; this change does not rewrite history or remove the original
Cloudinary uploads. No permission claim is made for those older images.
