# 📸 Image Upload Guide for Portfolio

## Where to Upload Your Photos

### 1. **Hero Section Images** (Homepage rotating images)
**Location:** `/public/hero/`

**Files needed:**
- `random-1.avif` (or .jpg, .png, .webp)
- `random-2.avif`
- `random-3.avif`
- ... up to `random-9.avif`

**Recommended:**
- Size: 1920x1080px or larger
- Format: AVIF, WebP, or JPG
- Showcases your best work

---

### 2. **Project Images**
**Location:** `/public/projects/`

**Naming suggestions:**
- `anna-jewelry-1.jpg`
- `anna-jewelry-2.jpg`
- `bedroom-modern-1.jpg`
- `kitchen-design-1.jpg`
- etc.

**Then update in:** `/content/projects/[project-name].yml`

Example:
```yaml
image: /projects/anna-jewelry-1.jpg
```

---

### 3. **About Page Images**
**Location:** `/public/about/`

**Examples:**
- `profile-photo.jpg` - Your professional photo
- `workspace.jpg` - Your design workspace
- `portfolio-samples.jpg`

**Then update in:** `/content/about.yml`

---

### 4. **Blog Images**
**Location:** `/public/blog/`

**Examples:**
- `design-process.jpg`
- `color-psychology.jpg`
- `furniture-design.jpg`

---

## 🎨 Image Best Practices

### Formats (in order of preference):
1. **AVIF** - Best compression, modern
2. **WebP** - Good compression, widely supported
3. **JPG** - Universal, good for photos
4. **PNG** - Use for graphics with transparency

### Recommended Sizes:
- **Hero images:** 1920x1080px or 1600x900px
- **Project images:** 1200x800px minimum
- **Thumbnails:** 600x400px
- **Profile photos:** 400x400px (square)

### File Size:
- Try to keep under 500KB per image
- Use online compression tools like:
  - TinyPNG.com
  - Squoosh.app
  - Compressor.io

---

## 📝 How to Reference Images in Content Files

### For Projects (`/content/projects/*.yml`):
```yaml
image: /projects/my-project-image.jpg
# or external URL:
image: https://images.unsplash.com/photo-...
```

### For Blog Posts (`/content/blog/*.md`):
```yaml
image: /blog/my-blog-image.jpg
```

### For About Page (`/content/about.yml`):
```yaml
images:
  - src: /about/profile-photo.jpg
    alt: Jehona Xhoxhaj
  - src: /about/workspace.jpg
    alt: My design workspace
```

---

## 🔄 After Adding Images:

1. Place your images in the appropriate `/public/` subfolder
2. Update the corresponding content file with the image path
3. Restart the development server if it's running:
   ```bash
   npm run dev
   ```

---

## 💡 Tips:

- **Consistent naming:** Use lowercase and hyphens (e.g., `modern-kitchen-1.jpg`)
- **Organize by project:** Keep related images together
- **Backup originals:** Keep high-res originals in a separate folder
- **Test locally:** Always check images load correctly before deploying

---

## Current Folder Structure:
```
/public/
├── hero/          ← Homepage carousel images
├── projects/      ← Individual project images  
├── about/         ← About page images
└── blog/          ← Blog post images
```
