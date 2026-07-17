#!/usr/bin/env python3
"""Rebuild stories/index.html from the story pages themselves.

The story HTML pages are the source of truth. This script scans every
stories/<slug>/index.html, extracts each story's title, lead and category
(from its <h1>, <p class="lead"> and <p class="eyebrow">), and rewrites the
card grid on the stories landing page. Nothing else on the landing is touched,
and story pages are never modified.

Card order follows sitemap.xml, so to control ordering (or publish a new
story), add its URL to sitemap.xml and run:

    python3 tools/rebuild_stories_landing.py

New story workflow:
  1. Create stories/<slug>/index.html (copy an existing story as template).
  2. Add https://whileone.se/stories/<slug>/ to sitemap.xml.
  3. Optionally add a card thumbnail to THUMBS below.
  4. Run this script.
"""
import re
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.dirname(HERE)
STORIES = os.path.join(WEB, "stories")
SITEMAP = os.path.join(WEB, "sitemap.xml")
LANDING = os.path.join(STORIES, "index.html")

# Card thumbnails: slug -> (image path relative to /images/stories/,
# CSS object-position that picks the crop focal point for the wide card).
# Stories without an entry render as text-only cards.
THUMBS = {
    "building-a-patentable-test-system": ("patent-device-farm.jpg", "50% 32%"),
    "mainframe-dependency-map": ("mainframe-keypunch.jpg", "50% 12%"),
    "pipeline-monitoring": ("pipeline-monitoring-wall.jpg", "50% 38%"),
    "year-in-palo-alto": ("early-days.jpg", "50% 42%"),
    "musical-bathroom": ("bathroom-install.jpg", "50% 62%"),
    "test-environments-on-tap": ("test-environments-on-tap.svg", "50% 50%"),
    "e2e-tests-live-in-slack": ("e2e-slack-run.jpg", "50% 64%"),
    "friday-evening-bike-racks": ("bike-rack-office-1.jpg", "50% 55%"),
    "the-outage-alarm": ("outage-alarm-install.jpg", "50% 14%"),
    "self-driving-tiger-tank": ("tiger-tank.jpg", "50% 28%"),
    "two-unknown-devices": ("wifi-pcap-list.jpg", "50% 50%"),
    "pacing-the-ai-tools": ("token-monitor-exhausted.jpg", "50% 45%"),
    "self-service-fast-track": ("self-service-fast-track.svg", "50% 50%"),
}


def extract(slug):
    fp = os.path.join(STORIES, slug, "index.html")
    if not os.path.isfile(fp):
        return None
    t = io.open(fp, encoding="utf-8").read()

    def grab(pat):
        m = re.search(pat, t, re.S)
        return re.sub(r"\s+", " ", m.group(1)).strip() if m else ""

    title = grab(r"<h1>(.*?)</h1>")
    lead = grab(r'<p class="lead">(.*?)</p>')
    eyebrow = grab(r'<p class="eyebrow">(.*?)</p>')
    cat = (eyebrow.split("·", 1)[1].strip() if "·" in eyebrow
           else eyebrow.replace("Story", "").strip())
    return {"slug": slug, "title": title, "lead": lead, "cat": cat}


def main():
    sm = io.open(SITEMAP, encoding="utf-8").read()
    slugs = re.findall(r"/stories/([a-z0-9-]+)/</loc>", sm)

    cards, seen = [], set()
    for slug in slugs:
        if slug in seen:
            continue
        seen.add(slug)
        s = extract(slug)
        if not s or not s["title"]:
            print(f"  ! skipping {slug} (page missing or no <h1>)")
            continue
        thumb = ""
        if slug in THUMBS:
            img, pos = THUMBS[slug]
            if not os.path.isfile(os.path.join(WEB, "images", "stories", img)):
                print(f"  ! {slug}: thumbnail {img} not found — card left text-only")
            else:
                style = (f' style="object-position: {pos}"'
                         if pos != "50% 50%" else "")
                thumb = (
                    f'                    <a class="card-thumb" href="{slug}/"'
                    ' tabindex="-1" aria-hidden="true">'
                    f'<img src="../images/stories/{img}"{style}'
                    ' alt="" loading="lazy"></a>\n'
                )
        cards.append(
            '                <article class="card">\n'
            + thumb +
            f'                    <p class="story-card-meta">{s["cat"]}</p>\n'
            f'                    <h3><a href="{s["slug"]}/">{s["title"]}</a></h3>\n'
            f'                    <p>{s["lead"]}</p>\n'
            '                </article>'
        )

    # warn about story folders not in the sitemap
    for entry in sorted(os.listdir(STORIES)):
        if os.path.isdir(os.path.join(STORIES, entry)) and entry not in seen:
            print(f"  ! {entry}/ exists but is not in sitemap.xml — not listed")

    grid = '<div class="grid two-up">\n' + "\n".join(cards) + "\n            </div>"
    idx = io.open(LANDING, encoding="utf-8").read()
    new_idx, n = re.subn(r'<div class="grid two-up">.*?</div>', grid, idx,
                         count=1, flags=re.S)
    if n != 1:
        sys.exit("ERROR: could not find the card grid in stories/index.html")
    io.open(LANDING, "w", encoding="utf-8").write(new_idx)
    print(f"stories/index.html rebuilt with {len(cards)} cards.")


if __name__ == "__main__":
    main()
