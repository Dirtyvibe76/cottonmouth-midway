#!/usr/bin/env python3
"""Update the Music Tent's Now Playing embed from the latest public YouTube upload.

Set the GitHub Actions variable YOUTUBE_CHANNEL_ID to avoid channel-ID discovery.
Otherwise the channel is discovered from the known existing featured video.
No YouTube API key is necessary.
"""
import html
import os
import re
import sys
import urllib.request
from pathlib import Path
from xml.etree import ElementTree

PAGE = Path("music.html")
FEATURED_VIDEO = "0KG-_9plQZw"  # existing Cottonmouth Clown music embed
START = "<!-- NOW_PLAYING_START:"
END = "<!-- NOW_PLAYING_END -->"


def channel_id():
    configured = os.environ.get("YOUTUBE_CHANNEL_ID", "").strip()
    if configured:
        if not re.fullmatch(r"UC[A-Za-z0-9_-]{22}", configured):
            raise ValueError("YOUTUBE_CHANNEL_ID must be a 24-character UC... ID")
        return configured
    # One-time fallback: discover the channel from the original music video.
    from yt_dlp import YoutubeDL
    with YoutubeDL({"quiet": True, "no_warnings": True, "skip_download": True,
                    "extract_flat": False}) as yt:
        info = yt.extract_info("https://www.youtube.com/watch?v=" + FEATURED_VIDEO, download=False)
    found = info.get("channel_id", "")
    if not re.fullmatch(r"UC[A-Za-z0-9_-]{22}", found):
        raise RuntimeError("Could not identify YouTube channel; set YOUTUBE_CHANNEL_ID repo variable")
    return found


def newest_upload(cid):
    url = "https://www.youtube.com/feeds/videos.xml?channel_id=" + cid
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 CottonmouthMidway/1.0"})
    with urllib.request.urlopen(request, timeout=25) as response:
        root = ElementTree.fromstring(response.read())
    atom = "{http://www.w3.org/2005/Atom}"
    yt = "{http://www.youtube.com/xml/schemas/2015}"
    entries = root.findall(atom + "entry")
    if not entries:
        raise RuntimeError("YouTube feed has no public uploads; leaving old feature intact")
    entries.sort(key=lambda e: e.findtext(atom + "published", default=""), reverse=True)
    latest = entries[0]
    title = latest.findtext(atom + "title") or "Latest release"
    vid = latest.findtext(yt + "videoId") or ""
    if not re.fullmatch(r"[A-Za-z0-9_-]{11}", vid):
        raise RuntimeError("Invalid YouTube video ID in feed")
    return vid, title


def main():
    vid, title = newest_upload(channel_id())
    original = PAGE.read_text(encoding="utf-8")
    if original.count(START) != 1 or original.count(END) != 1:
        raise RuntimeError("Expected one set of NOW_PLAYING markers")
    safe_title = html.escape(title, quote=True)
    replacement = (
        "<!-- NOW_PLAYING_START: automatically updated from Cottonmouth Clown's YouTube uploads -->\n"
        '<div class="featured-track" id="now-playing">\n'
        '    <h2>NOW PLAYING — LATEST RELEASE</h2>\n'
        f'    <p>{safe_title}</p>\n'
        f'    <iframe loading="lazy" width="100%" height="450" '
        f'src="https://www.youtube.com/embed/{vid}" '
        f'title="{safe_title}" frameborder="0" allowfullscreen></iframe>\n'
        '</div>\n'
        "<!-- NOW_PLAYING_END -->"
    )
    pattern = re.compile(re.escape(START) + r".*?" + re.escape(END), re.DOTALL)
    updated, count = pattern.subn(lambda _: replacement, original, count=1)
    if count != 1:
        raise RuntimeError("Failed to locate Now Playing")
    if updated != original:
        PAGE.write_text(updated, encoding="utf-8")
        print(f"Updated Now Playing to: {title} ({vid})")
    else:
        print(f"Already current: {title} ({vid})")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"Now Playing unchanged: {exc}", file=sys.stderr)
        sys.exit(1)
