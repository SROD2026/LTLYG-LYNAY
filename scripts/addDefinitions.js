import fs from "fs";
import { emotionDefinitions } from "../src/utils/emotionDefinitions.js";

const file = "public/data/meta/emotionMeta.json";

const data = JSON.parse(fs.readFileSync(file, "utf8"));

for (const emotion of Object.keys(data)) {
  if (!data[emotion].definition) {
    data[emotion].definition =
      emotionDefinitions[emotion] ||
      "An emotional signal indicating an unmet or fulfilled need.";
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("Definitions added.");