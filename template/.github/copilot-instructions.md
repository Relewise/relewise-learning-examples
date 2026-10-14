# Relewise learning project

This project teaches Relewise through small, readable TypeScript examples. Follow `QUICKSTART.md` for the intended sequence and `src/examples/README.md` for the example map.

- Keep each SDK request and its response handling visible in the example.
- Use official SDK types and builders, meaningful names, and short comments explaining why.
- Share configuration; prefer visible repetition to generic wrappers.
- Correct supplied data rather than adding normalizers or validation frameworks.
- Reuse imported product/category IDs and the shared demo user across the core journey.
- Let errors reach the runner. Do not add retry machinery or print success after failure.
- Keep historical imports and external profile examples optional. Avoid unsupported personalization claims.
- Keep `.env` private and write credentials on the server. Obtain authorization before sending live imports or tracking events.
- Update `QUICKSTART.md` when behavior changes. Run `npm run build` and `npm run lint`, plus relevant offline checks.

Use the installed SDK declarations and https://docs.relewise.com to verify behavior. Keep the result understandable to someone learning the API.
