import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");

const replacements = [
  ["shadow-[#F97316]/5", "shadow-primary/5"],
  ["shadow-[#F97316]/10", "shadow-primary/10"],
  ["ring-offset-[#100D0B]", "ring-offset-background"],
  ["via-[#211C12]", "via-muted"],
  ["via-[#24160F]", "via-muted"],
  ["via-[#231C19]", "via-muted"],
  ["via-[#1F1916]", "via-muted"],
  ["from-[#231C19]", "from-muted"],
  ["from-[#211B18]", "from-card"],
  ["to-[#191412]", "to-background"],
  ["to-[#1A1513]", "to-background"],
  ["bg-[#514943]", "bg-muted"],
  ["border-[#514943]", "border-border"],
  ["placeholder:text-[#716963]", "placeholder:text-muted-foreground"],
  ["text-[#716963]", "text-muted-foreground"],
  ["hover:border-[#57443A]", "hover:border-border"],
  ["bg-[#241D19]", "bg-muted"],
  ["bg-[#0C0A09]", "bg-background"],
  ["border-[#29221E]", "border-border"],
  ["bg-[#161210]/70", "bg-card/70"],
  ["bg-[#161210]", "bg-card"],
  ["text-[#E7E5E4]", "text-foreground"],
  ["hover:bg-[#1E1916]", "hover:bg-muted"],
  ["hover:border-[#3F3530]", "hover:border-border"],
  ["hover:bg-[#1C1714]", "hover:bg-muted"],
  ["bg-[#171310]", "bg-card"],
  ["bg-[#17251C]", "bg-green-500/10"],
  ["bg-[#291717]", "bg-red-500/10"],
  ["bg-[#17110E]", "bg-card"],
  ["bg-[#15110F]", "bg-card"],
  ["bg-[#0D0A09]", "bg-background"],
  ["bg-[#211914]", "bg-muted"],
  ["hover:border-white/[0.1]", "hover:border-border"],
  ["text-[#8C8580]", "text-muted-foreground"],
  ["bg-[#271C10]", "bg-orange-500/10"],
  ["bg-[#281414]", "bg-red-500/10"],
  ["text-[#7BC47F]", "text-green-500"],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  let content = fs.readFileSync(file, "utf8");
  const original = content;
  for (const [from, to] of replacements) {
    content = content.split(from).join(to);
  }
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed += 1;
    console.log("updated", path.relative(root, file));
  }
}
console.log(`Done. Updated ${changed} files.`);
