#!/usr/bin/env python3
"""Create WebP/AVIF derivatives and record dimensions/bytes in the asset manifest."""
import argparse
import hashlib
import io
import json
from pathlib import Path

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parents[4]
STATIC = ROOT / "src/static"
MANIFEST = STATIC / "assets/asset-manifest.json"


def optimize(asset, widths, quality, lossless, format):
    source = STATIC / asset["path"].lstrip("/")
    with Image.open(source) as original:
        if getattr(original, "is_animated", False):
            raise ValueError(f"Animated image requires manual review: {source}")
        mode = "RGBA" if "A" in original.getbands() or "transparency" in original.info else "RGB"
        image = ImageOps.exif_transpose(original)
        if original.info.get("icc_profile"):
            image = ImageCms.profileToProfile(image, io.BytesIO(original.info["icc_profile"]), ImageCms.createProfile("sRGB"), outputMode=mode)
        else:
            image = image.convert(mode)
        files = []
        for width in sorted({min(w, image.width) for w in widths}):
            height = max(1, round(image.height * width / image.width))
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            output = io.BytesIO()
            # Strip EXIF/GPS and other source metadata from public derivatives.
            options = {"lossless": lossless, "method": 6} if format == "webp" else {"speed": 6, "subsampling": "4:4:4"}
            resized.save(output, format.upper(), quality=quality, **options, exif=b"", icc_profile=b"", xmp=b"")
            data = output.getvalue()
            if len(data) >= source.stat().st_size:
                print(f"Skip {source.name} at {width}px: no byte saving")
                continue
            path = f"/assets/images/{source.stem}-web-{width}.{format}"
            files.append(({"path": path, "width": width, "height": height, "format": format, "bytes": len(data)}, data))
    if not files:
        raise ValueError(f"No beneficial derivatives for {source.name}; keep its existing format")
    old = set(asset.get("optimization", {}).get("files", []))
    for file, data in files:
        target = STATIC / file["path"].lstrip("/")
        if target.exists() and file["path"] not in old:
            raise ValueError(f"Refusing to overwrite an unmanaged file: {target}")
    for file, data in files:
        (STATIC / file["path"].lstrip("/")).write_bytes(data)
    new = [file["path"] for file, _ in files]
    for path in old - set(new):
        (STATIC / path.lstrip("/")).unlink(missing_ok=True)
    asset["files"] = [file for file in asset["files"] if file["path"] not in old] + [file for file, _ in files]
    asset["variants"] = [path for path in asset.get("variants", []) if path not in old] + new
    # Refresh the source entry too when a registered image has been updated.
    for file in asset["files"]:
        if file["path"] == asset["path"]:
            with Image.open(source) as original:
                width, height = ImageOps.exif_transpose(original).size
                file.update(width=width, height=height, bytes=source.stat().st_size)
    asset["optimization"] = {"widths": widths, "quality": quality, "lossless": lossless, "format": format, "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(), "files": new}
    largest = files[-1][0]
    before = source.stat().st_size
    print(f"{source.name}: {before:,} -> {largest['bytes']:,} bytes ({100 * (1 - largest['bytes'] / before):.1f}% saved), largest {largest['width']}x{largest['height']}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", nargs="?", help="Registered image filename or /assets/images/... path")
    parser.add_argument("--widths", default="640,1200", help="Comma-separated pixel widths; never upscales")
    parser.add_argument("--quality", type=int, default=82)
    parser.add_argument("--format", choices=["webp", "avif"], default="webp")
    parser.add_argument("--lossless", action="store_true", help="For diagrams, text and logos")
    parser.add_argument("--all", action="store_true", help="Regenerate every configured image, using its saved settings")
    args = parser.parse_args()
    if args.lossless and args.format != "webp":
        parser.error("Lossless mode requires WebP")
    if bool(args.image) == args.all:
        parser.error("Choose one image or --all")
    try:
        widths = sorted(set(int(w) for w in args.widths.split(",")))
    except ValueError:
        parser.error("Widths must be comma-separated integers")
    if not widths or min(widths) < 1 or not 1 <= args.quality <= 100:
        parser.error("Widths must be positive and quality must be 1-100")
    manifest = json.loads(MANIFEST.read_text())
    selected = [asset for asset in manifest["assets"] if asset.get("optimization")] if args.all else [asset for asset in manifest["assets"] if asset["path"] == (args.image if args.image.startswith("/") else f"/assets/images/{args.image}")]
    if not selected:
        parser.error("No matching registered image. Add the source to asset-manifest.json first.")
    for asset in selected:
        config = asset["optimization"] if args.all else {"widths": widths, "quality": args.quality, "lossless": args.lossless, "format": args.format}
        optimize(asset, config["widths"], config["quality"], config["lossless"], config.get("format", "webp"))
        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    main()
