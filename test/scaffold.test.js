import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const repository = fileURLToPath(new URL('../', import.meta.url));

// Exercise what npm actually ships, including dotfiles that npm treats specially.
test('packed CLI creates a usable project without overwriting existing files', async (t) => {
    const directory = await mkdtemp(path.join(tmpdir(), 'relewise-scaffold-'));
    t.after(async () => {
        assert.equal(path.dirname(directory), path.resolve(tmpdir()));
        assert.ok(path.basename(directory).startsWith('relewise-scaffold-'));
        await rm(directory, { recursive: true, force: true });
    });

    const packed = execFileSync(
        'npm pack --json --ignore-scripts --pack-destination "' + directory + '"',
        {
            cwd: repository,
            shell: true,
            encoding: 'utf8',
        },
    );
    const [{ filename, files }] = JSON.parse(packed);
    const names = files.map((file) => file.path);
    assert.ok(names.includes('template/gitignore.template'));
    assert.ok(names.includes('template/.env.local'));
    assert.ok(names.includes('template/assets/product-placeholder.png'));
    assert.ok(!names.includes('template/package-lock.json'));
    assert.ok(!names.some((name) => name.includes('/node_modules/') || name.includes('/dist/')));
    execFileSync('tar', ['-xf', path.join(directory, filename), '-C', directory]);
    const { createProject } = await import(
        pathToFileURL(path.join(directory, 'package/bin/create-project.js')).href
    );

    // Include spaces in the parent path, as common on developers' machines.
    const parent = path.join(directory, 'learning projects');
    await mkdir(parent);
    const project = await createProject('example-shop', 'Learning Relewise', parent);
    const packageJson = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'));
    assert.equal(packageJson.name, 'example-shop');
    assert.equal(packageJson.description, 'Learning Relewise');
    assert.equal(packageJson.dependencies['@relewise/create-relewise-learning-example'], undefined);
    assert.equal(
        await readFile(path.join(project, 'LICENSE'), 'utf8'),
        await readFile(path.join(repository, 'LICENSE'), 'utf8'),
    );
    assert.match(await readFile(path.join(project, '.env'), 'utf8'), /<YOUR-API-KEY>/);
    // CI also verifies that the published template installs and runs on each supported platform.
    if (process.env.VERIFY_PACKED_PROJECT === 'true') {
        for (const command of [
            'npm install --ignore-scripts --no-fund',
            'npm run build',
            'npm run lint',
            'npm run dev -- --help',
            'npm start -- --help',
        ]) {
            execFileSync(command, { cwd: project, shell: true, stdio: 'inherit' });
        }
    }
    execFileSync('git', ['init', '--quiet'], { cwd: project });
    assert.equal(spawnSync('git', ['check-ignore', '.env'], { cwd: project }).status, 0);
    assert.equal(spawnSync('git', ['check-ignore', 'tsconfig.json'], { cwd: project }).status, 1);

    await writeFile(path.join(project, '.env'), 'KEEP THIS FILE');
    const gitHead = await readFile(path.join(project, '.git/HEAD'), 'utf8');
    await assert.rejects(createProject('example-shop', 'Replacement', parent), /already exists/);
    assert.equal(await readFile(path.join(project, '.env'), 'utf8'), 'KEEP THIS FILE');
    assert.equal(await readFile(path.join(project, '.git/HEAD'), 'utf8'), gitHead);
    for (const name of ['.', '..', '../outside', path.join(directory, 'outside')]) {
        await assert.rejects(createProject(name, '', parent), /project name/);
    }
});

test('CLI help and version work without prompting', async () => {
    const cli = path.join(repository, 'bin/index.js');
    assert.match(execFileSync(process.execPath, [cli, '--help'], { encoding: 'utf8' }), /Usage:/);
    const packageJson = JSON.parse(await readFile(path.join(repository, 'package.json'), 'utf8'));
    assert.equal(
        execFileSync(process.execPath, [cli, '--version'], { encoding: 'utf8' }).trim(),
        packageJson.version,
    );
});
