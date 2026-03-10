import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

type Finding = {
  file: string;
  line: number;
  column: number;
  rule: string;
  match: string;
};

const SCAN_DIRS = ['src', 'prisma'];
const SCAN_FILES = ['README.md', '.env.example', 'next.config.ts', 'eslint.config.mjs'];

const ALLOWED_EXTENSIONS = new Set(['.ts', '.tsx', '.md', '.css', '.mjs', '.json', '.txt', '.d.ts']);

const MOJIBAKE_RULES: Array<{ rule: string; regex: RegExp }> = [
  {
    rule: 'mojibake-seq',
    regex: /(?:Â|Ã|ðŸ|â€|â€™|â€œ|â€|â€”|â€“|â€¦|â€¢|â†’)/g,
  },
  {
    rule: 'control-chars',
    // Excludes \t \n \r; flags C0 + DEL + C1 controls.
    regex: /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u0080-\u009F]/g,
  },
];

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build', 'coverage']);

function toPos(text: string, index: number): { line: number; column: number } {
  let line = 1;
  let column = 1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }
  return { line, column };
}

function describeMatch(match: string) {
  const codePoints = Array.from(match).map((ch) => `U+${ch.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0')}`);
  const visible = match.replaceAll('\n', '\\n').replaceAll('\r', '\\r').replaceAll('\t', '\\t');
  return `${visible} (${codePoints.join(' ')})`;
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...(await walk(path.join(dir, entry.name))));
      continue;
    }

    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;
    files.push(path.join(dir, entry.name));
  }

  return files;
}

async function main() {
  const repoRoot = process.cwd();
  const targets: string[] = [];

  for (const dir of SCAN_DIRS) {
    const fullDir = path.join(repoRoot, dir);
    targets.push(...(await walk(fullDir)));
  }

  for (const file of SCAN_FILES) {
    targets.push(path.join(repoRoot, file));
  }

  const findings: Finding[] = [];

  for (const absolutePath of targets) {
    let content: string;
    try {
      content = await readFile(absolutePath, 'utf8');
    } catch {
      continue;
    }

    for (const { rule, regex } of MOJIBAKE_RULES) {
      regex.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(content))) {
        const { line, column } = toPos(content, match.index);
        findings.push({
          file: path.relative(repoRoot, absolutePath),
          line,
          column,
          rule,
          match: match[0],
        });

        if (findings.length >= 200) break;
      }
      if (findings.length >= 200) break;
    }
    if (findings.length >= 200) break;
  }

  if (findings.length === 0) {
    process.stdout.write('lint-encoding: OK\n');
    return;
  }

  process.stderr.write(`lint-encoding: Found ${findings.length} possible encoding issues:\n`);
  for (const f of findings.slice(0, 50)) {
    process.stderr.write(`- ${f.file}:${f.line}:${f.column} [${f.rule}] ${describeMatch(f.match)}\n`);
  }
  if (findings.length > 50) process.stderr.write(`(showing first 50)\n`);
  process.exit(1);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

