# Big Top guest-artist lineup

The **Big Top** promotes other musicians, their YouTube videos, and their **original channels**. It deliberately uses YouTube embeds for guests; Cottonmouth's own self-hosted audio stays in the Music Tent.

## Add an artist

Edit `bigtop-artists.json` in the repository's `main` branch. Every artist has a name, official YouTube channel URL, optional description, and one or more YouTube video URLs.

Example **only** (do not publish these sample URLs as artists):

```json
{
  "artists": [
    {
      "name": "Artist's Stage Name",
      "description": "A brief introduction to this artist.",
      "channel": "https://www.youtube.com/@ArtistsRealHandle",
      "videos": [
        {
          "title": "Track or Video Title",
          "url": "https://www.youtube.com/watch?v=VIDEO_ID_HERE"
        }
      ]
    }
  ]
}
```

Replace the example with **real artist information**, then commit the JSON file. Cloudflare redeploys automatically when `main` changes.

- The **first** listed artist becomes the featured act. Their video only loads when the visitor clicks the Play button.
- Add as many artists as you like. A card is created automatically for each.
- Each card can feature multiple video links. Use a full watch link, `youtu.be`, `/shorts/`, or `/live/` link.
- YouTube channel URLs must identify the channel (e.g. `https://www.youtube.com/@Handle` or `https://www.youtube.com/channel/UC...`). A general YouTube homepage will not be accepted.
- The page uses YouTube's privacy-enhanced `youtube-nocookie.com` embed domain, never downloads other artists' audio, and supplies direct channel links.
- Be sure you have an artist's permission where needed and verify the video allows embedding.
- YouTube recommendation/advertising behavior is controlled by YouTube, not this site.

**No direct server-side editing interface is exposed publicly.** The lineup is published through the GitHub repository so visitors cannot add arbitrary videos to your website.

## File structure

- `bigtop.html`: Big Top stage and roster UI
- `bigtop.js`: client-side rendering and video/channel URL validation
- `bigtop-artists.json`: editable curated guest list
- `style.css`: responsive styling

To add a guest using ChatGPT, simply provide the artist's **name**, **channel URL**, and **YouTube song/video URL(s)**. The GitHub catalog can be updated without touching the page layout.
