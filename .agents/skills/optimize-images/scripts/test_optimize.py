"""Run with the same Pillow environment: python scripts/test_optimize.py."""
import hashlib
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from PIL import Image, ImageCms
import optimize


class OptimizeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / "assets/images").mkdir(parents=True)
        self.source = self.root / "assets/images/test.png"
        image = Image.effect_noise((320, 240), 50).convert("RGB")
        exif = Image.Exif()
        exif[274] = 6  # Rotate to portrait before calculating derivatives.
        profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
        image.save(self.source, exif=exif, icc_profile=profile)
        self.original = self.source.read_bytes()
        self.asset = {"path": "/assets/images/test.png", "files": [{"path": "/assets/images/test.png", "format": "png"}], "variants": []}
        patcher = patch.object(optimize, "STATIC", self.root)
        patcher.start()
        self.addCleanup(patcher.stop)

    def test_metadata_orientation_no_upscale_and_repeatability(self):
        optimize.optimize(self.asset, [100, 1000], 60, False, "avif")
        config = self.asset["optimization"]
        files = self.asset["files"][1:]
        self.assertEqual([(f["width"], f["height"]) for f in files], [(100, 133), (240, 320)])
        self.assertEqual(config["sourceSha256"], hashlib.sha256(self.original).hexdigest())
        before = [(self.root / path.lstrip("/")).read_bytes() for path in config["files"]]
        for path in config["files"]:
            with Image.open(self.root / path.lstrip("/")) as image:
                image.load()
                self.assertFalse(image.getexif())
                self.assertFalse(image.info.get("icc_profile"))
        optimize.optimize(self.asset, [100, 1000], 60, False, "avif")
        self.assertEqual(before, [(self.root / path.lstrip("/")).read_bytes() for path in config["files"]])
        self.assertEqual(self.source.read_bytes(), self.original)

    def test_regeneration_removes_only_managed_variants(self):
        optimize.optimize(self.asset, [100, 240], 82, False, "webp")
        previous = self.asset["optimization"]["files"][:]
        unrelated = self.root / "assets/images/unrelated.webp"
        unrelated.write_bytes(b"keep")
        optimize.optimize(self.asset, [120], 60, False, "avif")
        self.assertTrue(all(not (self.root / path.lstrip("/")).exists() for path in previous))
        self.assertEqual(unrelated.read_bytes(), b"keep")
        self.assertEqual(len(self.asset["files"]), 2)

    def test_refuses_unmanaged_output(self):
        target = self.root / "assets/images/test-web-100.webp"
        target.write_bytes(b"keep")
        with self.assertRaisesRegex(ValueError, "unmanaged"):
            optimize.optimize(self.asset, [100], 82, False, "webp")
        self.assertEqual(target.read_bytes(), b"keep")

    def test_lossless_preserves_transparency(self):
        image = Image.new("RGBA", (256, 128), (200, 0, 0, 128))
        image.save(self.source, compress_level=0)
        optimize.optimize(self.asset, [256], 82, True, "webp")
        path = self.root / self.asset["optimization"]["files"][0].lstrip("/")
        with Image.open(path) as output:
            self.assertEqual(output.convert("RGBA").tobytes(), image.tobytes())


if __name__ == "__main__":
    unittest.main()
