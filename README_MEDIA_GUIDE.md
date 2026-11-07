# Samajbandh Media & Document Guide (For Non-Technical Administrators)
---

## 📁 1. Where Files Are Stored

All images and downloadable PDF documents are stored in the `/public` folder:

```
Samajbandh/
├── assets/
│   ├── Media/
│   │     ├── Samajbandh Material for Website  # All Provided Data required for website creation
├── public/
│   ├── content/
│   │    ├──media-config.json
│   ├── images/
│   │    ├──asha-kendra/
│   │    ├──awareness/
│   │    ├──brand/
│   │    ├──campaigns/
│   │    ├──fellowship/
│   │    ├──kurma/
│   │    ├──products/
│   │    ├──partners/
│   │    ├──samata-yatra/
│   │    ├──sdg/
│   │    ├──stories/
│   │    ├──sdg/
│   │    └── team/ 
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
1. Open `/public/content/media-config.json` or `src\data\mockData.ts`.
2. Find the section you want to change (e.g., `"hero_main"` or `"asha_pad_box"`).
3. Change the `"url"` to your new image path or web URL:
   ```json
   "hero_main": {
     "title": "Arogya Samwadak Tribal Drive",
     "url": "/public/images/hero/my-new-photo.jpg"
   }
   ```
4. Save the file.

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
