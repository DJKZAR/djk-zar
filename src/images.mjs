import manifest from "./static/assets/asset-manifest.json" with { type: "json" };

const files = new Map(manifest.assets.flatMap(asset => asset.files.map(file => [file.path, file])));
const optimized = new Map(manifest.assets.filter(asset => asset.optimization).map(asset => [asset.path, asset.optimization.files.map(path => files.get(path))]));
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");

// Resolve from the source URL so replacing an original only requires regeneration.
export function imageUrl(path) {
  return optimized.get(path)?.at(-1).path || path;
}

export function imageSource(path, sizes = "100vw") {
  const candidates = optimized.get(path);
  const file = files.get(imageUrl(path));
  if (!file) throw new Error(`Unregistered image: ${path}`);
  return `src="${escape(file.path)}" width="${file.width}" height="${file.height}"${candidates?.length > 1 ? ` srcset="${candidates.map(candidate => `${escape(candidate.path)} ${candidate.width}w`).join(", ")}" sizes="${escape(sizes)}"` : ""}`;
}
