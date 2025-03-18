import esbuild from 'esbuild';

esbuild.context({
  entryPoints: ['src/index.ts'],
  bundle: true,
  sourcemap: 'inline',
  format: 'esm',
  color: true,
  logLevel: 'debug',
  outfile: 'dist/index.js',
}).then(ctx => ctx.watch()).catch(() => process.exit(1));