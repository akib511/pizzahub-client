import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const replacements = [
  ["hover:bg-white/[0.08]", "hover:bg-muted"],
  ["hover:bg-white/[0.06]", "hover:bg-muted"],
  ["hover:bg-white/[0.025]", "hover:bg-muted"],
  ["hover:border-white/[0.15]", "hover:border-border"],
  ["border-white/[0.04]", "border-border"],
  ["border-white/5", "border-border"],
  ["bg-white/[0.015]", "bg-muted/30"],
  ["bg-white/[0.025]", "bg-muted/40"],
  ["bg-white/[0.03]", "bg-muted/50"],
  ["bg-white/[0.06]", "bg-muted"],
  ["bg-white/[0.07]", "bg-muted"],
  ["bg-white/[0.08]", "bg-muted"],
  ["bg-white/15", "bg-muted"],
  ["bg-white/20", "bg-muted-foreground/30"],
  ["text-gray-300", "text-muted-foreground"],
  ["text-stone-600", "text-muted-foreground"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "ui") continue;
      walk(full, files);
    } else if (/\.(tsx|jsx)$/.test(entry.name) && entry.name !== "Hero.tsx") {
      files.push(full);
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;
  for (const [from, to] of replacements) content = content.split(from).join(to);
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log(`Done. Updated ${changed} files.`);
