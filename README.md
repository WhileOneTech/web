# WhileOne Web

Static website for WhileOne - a high-tech consulting firm.

## Project Structure

```
whiletrue-web/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── contact.html            # Contact page
├── cv/                     # Public CV page + machine-readable resume.json
├── stories/                # Story pages (one folder per story) + landing
├── tools/                  # Maintenance scripts (no build step)
│   └── rebuild_stories_landing.py
├── css/                    # Stylesheets
│   ├── main.css           # Main styles
│   ├── reset.css          # CSS reset
│   └── components/        # Component styles
├── js/                     # JavaScript
│   ├── main.js            # Main scripts
│   └── components/        # Component scripts
├── images/                 # Images
├── fonts/                  # Web fonts
└── assets/                 # Other assets
```

## Stories

The story HTML pages under `stories/<slug>/index.html` are the source of
truth. The landing page (`stories/index.html`) lists a card per story and is
generated from the pages themselves.

To publish a new story:

1. Create `stories/<slug>/index.html` (copy an existing story as a template;
   keep the `<h1>`, `<p class="lead">` and `<p class="eyebrow">` — the landing
   card is built from those).
2. Add `https://whileone.se/stories/<slug>/` to `sitemap.xml`
   (sitemap order = landing order).
3. Run `python3 tools/rebuild_stories_landing.py`.

## Design Philosophy

Sleek, modern, minimalistic design for a high-tech consulting firm.

## Development

This is a static website using vanilla HTML, CSS, and JavaScript.

To view locally, simply open `index.html` in a web browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

## Browser Support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
