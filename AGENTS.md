# Contributor instructions

This repository teaches developers how to implement Relewise. Readers should see the data, SDK request, and response handling together.

- Keep `template/QUICKSTART.md` as the canonical journey: setup, catalog and index, tracking, search, recommendations, then updates. Keep historical imports and external profile examples optional.
- Write direct, readable TypeScript using the official SDK types and builders. Use meaningful names and short comments that explain why.
- Prefer a little repetition to wrappers that hide the Relewise call. Share setup, not an integration framework.
- Fix sample data at its source. Do not add generic normalizers, schema validators, retry frameworks, or fallback layers.
- Reuse real catalog IDs and the same demo identity across core examples. Do not imply variant support without importing variants.
- Let failures reach the runner and fail the command. Do not log success after a failed request.
- Keep credentials out of Git and write keys out of browser examples. Do not run imports or tracking against a live dataset without authorization.
- Check behavior against the installed SDK and official docs. Do not promise ranking changes or historical-date weighting that the example cannot establish.
- Update commands and explanations alongside code changes. Run the build, lint, and relevant offline tests. Validate scaffold changes against the packed package.

The root project contains the CLI; `template/` contains the generated learning project. Avoid unrelated cleanup or abstractions added only for hypothetical future use.
