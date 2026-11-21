import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const skipFiles = new Set([
  path.normalize("components/theme/theme-provider.tsx"),
  path.normalize("components/theme/theme-toggle.tsx"),
  path.normalize("components/theme/themed-toaster.tsx"),
]);

const hexPairs = [
  ["#100D0B", "background"],
  ["#100d0b", "background"],
  ["#0B0908", "background"],
  ["#0B0907", "background"],
  ["#0F0C0A", "background"],
  ["#0F0D0C", "background"],
  ["#1C1715", "card"],
  ["#1c1715", "card"],
  ["#1B1511", "card"],
  ["#181310", "card"],
  ["#17120F", "card"],
  ["#151210", "card"],
  ["#1A1716", "card"],
  ["#211A16", "card"],
  ["#21160F", "card"],
  ["#29190F", "card"],
  ["#14110F", "card"],
  ["#25201D", "muted"],
  ["#302017", "muted"],
  ["#302824", "border"],
  ["#2E2925", "border"],
  ["#382319", "border"],
  ["#A8A29E", "muted-foreground"],
  ["#78716C", "muted-foreground"],
  ["#78716c", "muted-foreground"],
  ["#57534E", "muted-foreground"],
  ["#F5F3EF", "foreground"],
  ["#D6D3D1", "foreground"],
  ["#F97316", "primary"],
  ["#f97316", "primary"],
  ["#EA580C", "primary"],
  ["#ea6a0f", "primary"],
];

const literalReplacements = [
  ["bg-[#14251B]", "bg-green-500/10"],
  ["bg-[#291616]", "bg-red-500/10"],
  ["border-white/[0.08]", "border-border"],
  ["border-white/[0.07]", "border-border"],
  ["border-white/[0.06]", "border-border"],
  ["border-white/[0.05]", "border-border"],
  ["border-white/10", "border-border"],
  ["border-white/[0.06]", "border-border"],
  ["hover:border-white/15", "hover:border-border"],
  ["hover:bg-white/[0.04]", "hover:bg-muted"],
  ["hover:bg-white/10", "hover:bg-muted"],
  ["hover:bg-white/5", "hover:bg-muted"],
  ["hover:bg-white/20", "hover:bg-muted"],
  ["bg-white/[0.02]", "bg-muted/40"],
  ["bg-white/[0.04]", "bg-muted/50"],
  ["bg-white/[0.05]", "bg-muted"],
  ["bg-white/5", "bg-muted"],
  ["bg-white/10", "bg-muted"],
  ["text-stone-500", "text-muted-foreground"],
  ["text-stone-400", "text-muted-foreground"],
  ["text-stone-300", "text-muted-foreground"],
  ["text-stone-200", "text-muted-foreground"],
  ["text-gray-600", "text-muted-foreground"],
  ["text-gray-500", "text-muted-foreground"],
  ["text-gray-400", "text-muted-foreground"],
  ["placeholder:text-gray-600", "placeholder:text-muted-foreground"],
];

function replaceHexToken(content, hex, token) {
  const escaped = hex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content
    .replace(new RegExp(`bg-\\[${escaped}\\]`, "g"), `bg-${token}`)
    .replace(new RegExp(`from-\\[${escaped}\\]`, "g"), `from-${token}`)
    .replace(new RegExp(`via-\\[${escaped}\\]`, "g"), `via-${token}`)
    .replace(new RegExp(`to-\\[${escaped}\\]`, "g"), `to-${token}`)
    .replace(new RegExp(`text-\\[${escaped}\\]`, "g"), `text-${token}`)
    .replace(new RegExp(`border-\\[${escaped}\\]`, "g"), `border-${token}`)
    .replace(new RegExp(`hover:text-\\[${escaped}\\]`, "g"), `hover:text-${token}`)
    .replace(new RegExp(`hover:bg-\\[${escaped}\\]`, "g"), `hover:bg-${token}`)
    .replace(new RegExp(`hover:border-\\[${escaped}\\]`, "g"), `hover:border-${token}`)
    .replace(new RegExp(`focus:border-\\[${escaped}\\]`, "g"), `focus:border-${token}`)
    .replace(new RegExp(`focus-within:border-\\[${escaped}\\]`, "g"), `focus-within:border-${token}`)
    .replace(new RegExp(`placeholder:text-\\[${escaped}\\]`, "g"), `placeholder:text-${token}`)
    .replace(new RegExp(`ring-\\[${escaped}\\]`, "g"), `ring-${token}`)
    .replace(new RegExp(`divide-\\[${escaped}\\]`, "g"), `divide-${token}`);
}

function shouldKeepWhiteText(line) {
  return /bg-orange|bg-red-|bg-black|from-black|via-black|to-black|bg-primary|overlay|Hero/.test(
    line
  );
}

function transform(content, relativePath) {
  const isHero = relativePath.includes(`${path.sep}Hero.tsx`);
  let next = content;

  if (isHero) {
    next = next
      .replaceAll("bg-[#100D0B]", "bg-black")
      .replaceAll("from-[#100D0B]", "from-black")
      .replaceAll("via-[#100D0B]", "via-black")
      .replaceAll("to-[#100D0B]", "to-black");
    return next;
  }

  for (const [hex, token] of hexPairs) {
    next = replaceHexToken(next, hex, token);
  }

  for (const [from, to] of literalReplacements) {
    next = next.split(from).join(to);
  }

  next = next
    .split("\n")
    .map((line) => {
      if (shouldKeepWhiteText(line)) return line;
      return line
        .replaceAll("hover:text-white", "hover:text-foreground")
        .replaceAll("text-white", "text-foreground");
    })
    .join("\n");

  return next;
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "ui") continue;
      walk(full, files);
    } else if (/\.(tsx|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(root);
let changed = 0;

for (const file of files) {
  const relative = path.relative(root, file);
  if (skipFiles.has(path.normalize(relative))) continue;

  const original = fs.readFileSync(file, "utf8");
  const updated = transform(original, `${path.sep}${relative}`);
  if (updated !== original) {
    fs.writeFileSync(file, updated);
    changed += 1;
    console.log("updated", relative);
  }
}

console.log(`Done. Updated ${changed} files.`);
