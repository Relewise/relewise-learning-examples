# Relewise learning examples

Small TypeScript examples that show how to import products, track behavior, search, and recommend with Relewise. Each example keeps the SDK request visible so you can follow it and adapt it to your own integration.

## Create a learning project

You need Node.js 22 or newer and npm.

```sh
npx @relewise/create-relewise-learning-example
```

Choose a new project directory when prompted. The CLI copies the template, installs dependencies, builds the examples, and optionally initializes Git. It refuses an existing directory.

Then open the generated project's [QUICKSTART.md](template/QUICKSTART.md). It walks through setup, product import, search index configuration, tracking, search, recommendations, and ongoing updates. The examples call your dataset; use a dedicated learning dataset for the sample imports and events.

## Work on this repository

The root project is the scaffolding CLI. `template/` is the project it generates.

```sh
npm ci
npm test
cd template
npm install --ignore-scripts
cd ..
npm run test:examples
cd template
npm run build
npm run lint
npm run dev -- --help
```

To exercise the local scaffold, run `node bin/index.js` from the repository root and choose a new destination. To work directly in `template/`, copy `.env.local` to `.env` and follow the [quickstart](template/QUICKSTART.md).

Read [AGENTS.md](AGENTS.md) before changing the examples. Keep requests direct, explanations short, and sample IDs consistent across the journey. Update the quickstart alongside changes to behavior or commands.

## References

- [Official implementation steps](https://docs.relewise.com/docs/developer/implementation-steps.html)
- [TypeScript SDK documentation](https://docs.relewise.com/docs/developer/sdks/ts.html)
- [Relewise JavaScript SDK](https://github.com/Relewise/relewise-sdk-javascript)

The scaffold is distributed under the [MIT license](LICENSE).
