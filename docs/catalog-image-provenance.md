# Catalog image provenance

Status: image reuse permissions remain unverified as of October 15, 2026.

The sample catalog contains 274 image URLs, all hosted under
`res.cloudinary.com/relewisedemodata/image/upload/`. The repository stores URLs,
not copies of these image files. The optional custom-data import sends the URLs
to Relewise; it does not download the images.

The catalog was introduced in commit `1f10ea9` on July 31, 2025 ("added products").
That commit does not identify the original image sources or their licenses.
The repository's MIT license does not establish the provenance or permissions
for the externally hosted images. Searches of the repository history, internal
knowledgebase, and indexed Slack messages found no documentation confirming
those permissions.

Before making the repository public, confirm with the owner of the demo catalog
or Cloudinary account where the images came from and what permissions cover
their use in an externally shared learning resource. Record the source and
permission evidence here. Cloudinary hosting alone is not evidence of an image
license; its [terms of use](https://cloudinary.com/tou) distinguish uploaded
content from the hosting service.

If suitable permission cannot be established, replace the image URLs with
Relewise-owned or explicitly licensed sample assets, or remove the image field
from the lesson. Existing URLs also remain in Git history; changing the current
catalog alone does not remove those historical references.
