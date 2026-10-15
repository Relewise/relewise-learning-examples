# Reading SDK responses

Use the response type provided by the installed Relewise SDK. The examples read its result and facet properties directly; they do not need a second set of runtime type guards around SDK responses.

Treat a failed request differently from a successful request with no results. Let request failures reach the runner, which reports the error and exits unsuccessfully. When a successful response is empty, check the catalog, filters, language, currency, and search index as described in [QUICKSTART.md](../QUICKSTART.md).

For exact response fields, consult the installed SDK's TypeScript declarations and the [official SDK examples](https://docs.relewise.com/docs/developer/sdks/ts.html).
