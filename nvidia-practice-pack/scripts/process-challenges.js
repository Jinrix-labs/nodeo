import fs from "fs";
import path from "path";

const pack = JSON.parse(fs.readFileSync("./challenges/nvidia-practice-pack.json", "utf8"));
const dir = "./challenges";

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

pack.forEach(challenge => {
    const filePath = path.join(dir, `${challenge.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(challenge, null, 2), "utf8");
    console.log(`✅ Created ${filePath}`);
});
