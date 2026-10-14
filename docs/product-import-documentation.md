# Product import

The canonical walkthrough is [QUICKSTART.md](../template/QUICKSTART.md#2-import-the-catalog). It covers the supplied catalog, language and stock conventions, and how to verify imported products.

Read [productImportExample.ts](../template/src/examples/import/productImportExample.ts) for the mapping and batch calls. For update semantics and catalog synchronization, use the [official entity integration guide](https://docs.relewise.com/docs/developer/sdks/ts/integrations/entity-integration.html).

The core import includes the stock used by search and recommendations. The optional [custom data example](../template/src/examples/import/customDataImportExample.ts) adds descriptions and image URLs separately.
