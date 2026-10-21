# Samajbandh Media & Document Guide (For Non-Technical Administrators)

This guide explains how any team member can easily update photos, logos, banners, and PDF documents on the Samajbandh website without needing coding knowledge.

---

## 📁 1. Where Files Are Stored

All images and downloadable PDF documents are stored in the `/public` folder:

```
public/
├── images/
│   ├── hero/            # Homepage hero banners and top sliders
│   ├── programs/        # Photos for Asha Pad micro-units, school workshops, Gaokor shed reforms
│   ├── products/        # Asha reusable cloth pads, kits, travel pouches, packaging
│   ├── team/            # Photos of founder Sachin Asha Subhash, trustees, coordinators
│   ├── gallery/         # Field photos from Pune, Junnar, Gadchiroli, Nashik
│   ├── partners/        # Logos of NGOs, CSR partners, institutions
│   └── awards/          # Trophy, felicitation and recognition photos
└── docs/
    ├── transparency/    # Annual reports, 80G certificate, 12A certificate, CSR-1 registration
    ├── guidelines/      # Pad washing instructions, MHM training manuals, ToT guides
    └── volunteer/       # Volunteer code of conduct, internship logbook formats
```

---

## 🖼️ 2. How to Replace an Image

### Method 1: The Quick Drag-and-Drop Replacement (Recommended)
1. Prepare your new image (preferably `.jpg`, `.png`, or `.webp`).
2. Rename your new file to match the existing image name (for example, `hero-banner-main.jpg`).
3. Drop it into the respective folder (e.g. `/public/images/hero/hero-banner-main.jpg`).
4. Refresh the website in your browser. The new image will appear automatically!

### Method 2: Update the Image Link in the Media Config File
If you want to use a new image name or an external cloud URL (e.g. Google Drive / Imgur / Unsplash):
1. Open `/public/content/media-config.json`.
2. Find the section you want to change (e.g., `"hero_main"` or `"asha_pad_box"`).
3. Change the `"url"` to your new image path or web URL:
   ```json
   "hero_main": {
     "title": "Arogya Samwadak Tribal Drive",
     "url": "/public/images/hero/my-new-photo.jpg"
   }
   ```
4. Save the file.

### Method 3: Use the Built-in Admin Portal
1. Open the website and click on the **Admin** link in the footer (or visit `/admin`).
2. Go to the **Media & Documents Manager** tab.
3. Paste your image URL or choose a preset and click **Save Asset**.

---

## 📄 3. How to Update Official Documents & PDFs (80G, Annual Reports)

1. Put your updated PDF into `/public/docs/transparency/` (for example: `samajbandh_annual_report_2025_26.pdf`).
2. In `/public/content/media-config.json`, update the corresponding document link.
3. Donors clicking "Download 80G Certificate" or "Annual Audit" will instantly get the new PDF!

---

## 💡 Recommended Image Sizes for Best Quality:

- **Hero Banners**: 1920 × 1080 pixels (Landscape)
- **Program & Workshop Cards**: 800 × 600 pixels (4:3 ratio)
- **Product Photos**: 800 × 800 pixels (1:1 square)
- **Team Portraits**: 500 × 500 pixels (1:1 square)
- **Partner Logos**: 400 × 200 pixels (Transparent PNG)
