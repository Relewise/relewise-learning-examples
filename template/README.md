# Relewise learning project

Runnable TypeScript examples for importing products, tracking behavior, searching, and recommending with Relewise.

Start with [QUICKSTART.md](QUICKSTART.md). It is the guide for this project, including credentials, sample data, the order to run examples, and what to expect from a new dataset.

You need Node.js 22 or newer and npm. Run commands from this directory:

```sh
npm run dev -- --help
npm run build
npm start -- --help
```

Help lists the examples without requiring credentials. After completing the quickstart setup, run an example by name:

```sh
npm run dev -- termBasedSearchExample "headphones"
```

`src/examples/` contains the SDK calls. `src/config/relewiseConfig.ts` holds shared clients, language, currency, and the demo user. `product_data/` contains the sample catalog and optional historical orders. See the [example map](src/examples/README.md) for individual files.

These examples send real requests to your configured dataset. Use a dedicated learning dataset. Keep `.env` private and keep keys with write permissions on the server.

To check changes locally:

```sh
npm run build
npm run lint
```

For the full API and SDK reference, use [docs.relewise.com](https://docs.relewise.com/docs/developer/sdks/ts.html).
