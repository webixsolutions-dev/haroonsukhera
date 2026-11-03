#!/usr/bin/env python3
"""Place real website screenshots onto the green screens of the mockup scenes.

Usage:
  python3 scripts/compose_mockups.py --mockup assets/mockups/mock-laptop-angle.png \
      --shots shots/zelvomart-desktop.png --out public/images/work/zelvomart.webp

  Multi-screen scenes take one screenshot per screen, ordered LEFT to RIGHT:
  python3 scripts/compose_mockups.py --mockup assets/mockups/mock-trio.png \
      --shots shots/x-tablet.png shots/x-desktop.png shots/x-mobile.png --out public/images/work/x-trio.webp

Requires: pip install pillow numpy scipy
"""
import argparse
import numpy as np
from PIL import Image
from scipy import ndimage


def find_screens(rgb):
    r, g, b = rgb[..., 0].astype(int), rgb[..., 1].astype(int), rgb[..., 2].astype(int)
    mask = (g > 170) & (r < 110) & (b < 110)
    labels, n = ndimage.label(mask)
    screens = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(labels == i)
        bw, bh = np.ptp(xs) + 1, np.ptp(ys) + 1
        if len(xs) < 10000 or min(bw, bh) < 60:  # skip green reflections on glass bases
            continue
        s, d = xs + ys, xs - ys
        tl = (xs[s.argmin()], ys[s.argmin()])
        br = (xs[s.argmax()], ys[s.argmax()])
        tr = (xs[d.argmax()], ys[d.argmax()])
        bl = (xs[d.argmin()], ys[d.argmin()])
        screens.append({"quad": [tl, tr, br, bl], "mask": labels == i, "x": xs.min()})
    screens.sort(key=lambda s: s["x"])
    return screens, mask


def perspective_coeffs(dst, src):
    # coefficients that map output (dst) points back to input (src) points
    a = []
    for (x, y), (u, v) in zip(dst, src):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y])
    A = np.array(a, dtype=float)
    B = np.array([p for uv in src for p in uv], dtype=float)
    return np.linalg.solve(A, B).tolist()


def fit_shot(shot, quad):
    tl, tr, br, bl = [np.array(p, float) for p in quad]
    w = (np.linalg.norm(tr - tl) + np.linalg.norm(br - bl)) / 2
    h = (np.linalg.norm(bl - tl) + np.linalg.norm(br - tr)) / 2
    target_ratio = w / h
    sw, sh = shot.size
    if sw / sh > target_ratio:  # too wide -> crop sides
        nw = int(sh * target_ratio)
        shot = shot.crop(((sw - nw) // 2, 0, (sw - nw) // 2 + nw, sh))
    else:  # too tall -> keep the top of the page
        shot = shot.crop((0, 0, sw, int(sw / target_ratio)))
    return shot


def compose(mockup_path, shot_paths, out_path):
    base = Image.open(mockup_path).convert("RGB")
    rgb = np.array(base)
    screens, _ = find_screens(rgb)
    if len(screens) != len(shot_paths):
        raise SystemExit(f"{mockup_path}: found {len(screens)} green screen(s) but got {len(shot_paths)} screenshot(s)")
    out = base.copy()
    for scr, path in zip(screens, shot_paths):
        shot = fit_shot(Image.open(path).convert("RGB"), scr["quad"])
        sw, sh = shot.size
        coeffs = perspective_coeffs(scr["quad"], [(0, 0), (sw, 0), (sw, sh), (0, sh)])
        warped = shot.transform(base.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)
        m = ndimage.binary_dilation(scr["mask"], iterations=2)
        out.paste(warped, (0, 0), Image.fromarray((m * 255).astype("uint8")))
    # remove green spill (reflections on glass bases) outside the screens
    arr = np.array(out).astype(int)
    screen_area = ndimage.binary_dilation(np.any([s["mask"] for s in screens], axis=0), iterations=3)
    r, g, b = arr[..., 0], arr[..., 1], arr[..., 2]
    spill = (g > np.maximum(r, b) * 1.15 + 6) & ~screen_area
    mx = np.maximum(r, b)
    new_g = mx + (g - mx) * 0.2
    arr[..., 0] = np.where(spill, np.clip(r + (g - new_g) * 0.9, 0, 255), r)
    arr[..., 1] = np.where(spill, new_g, g)
    Image.fromarray(arr.astype("uint8")).save(out_path, quality=88)
    print(f"saved {out_path} ({len(screens)} screen(s))")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--mockup", required=True)
    ap.add_argument("--shots", nargs="+", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    compose(a.mockup, a.shots, a.out)
