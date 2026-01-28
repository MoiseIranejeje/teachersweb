# Academic Portfolio Website

A clean, minimal, ultra-fast academic website for Byiringiro Albert, M.Ed., B.Ed. - Educationist, Researcher, and Consultant based in Kigali, Rwanda.

## Features

- 🎯 **Professional Academic Portfolio**
- 🔐 **Controlled-Access Publication Library**
- ⚡ **Ultra-Fast Performance** (Target: <1s load time)
- 📱 **Fully Responsive Design**
- 🔒 **Basic Copyright Protection**
- 📄 **Embedded PDF Viewer with Watermarks**
- 📊 **Publication Management System**

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **No Frameworks**: No React, Vue, Angular, or large libraries
- **Architecture**: Static Site, Serverless-ready
- **Deployment**: Compatible with Vercel, Netlify, GitHub Pages
- **Optional Fallback**: Firebase Hosting + Storage

## Project Structure

```
project-root/
├── index.html                 # Home page
├── about.html                 # Author biography & philosophy
├── publications.html          # Publications listing
├── reader.html                # Online document reader
├── contact.html               # Download request form
├── assets/
│   ├── css/
│   │   ├── main.css          # Global styles
│   │   └── reader.css        # PDF reader styles
│   ├── js/
│   │   ├── main.js           # Navigation, animations
│   │   ├── publications.js   # Load publications data
│   │   ├── reader.js         # PDF viewer logic
│   │   └── security.js       # Basic frontend protections
│   ├── fonts/                # Web fonts
│   └── images/               # Optimized images
├── data/
│   ├── publications.json     # Publications metadata
│   └── author.json           # Author profile data
├── docs/
│   └── previews/             # Watermarked preview PDFs
├── serverless/
│   └── request-download.js   # Handle download requests
└── README.md
```

## Setup Instructions

### 1. Local Development

```bash
# Clone or download the project
# Navigate to project directory
cd project-root

# Install a simple HTTP server (if needed)
npm install -g http-server

# Start local server
http-server -p 8080
```

### 2. Add Publications

Edit `data/publications.json` to add your publications:

```json
{
  "id": "unique-id",
  "title": "Publication Title",
  "authors": ["Your Name", "Co-author"],
  "year": 2023,
  "category": "Research Article",
  "journal": "Journal Name",
  "abstract": "Abstract text here...",
  "previewFile": "your-file.pdf",
  "downloadRequestable": true
}
```

### 3. Add Preview PDFs

Place watermarked PDF previews in `docs/previews/` directory. Name them according to the `previewFile` field in publications.json.

### 4. Customization

1. **Colors**: Edit CSS variables in `assets/css/main.css` (root section)
2. **Content**: Update text in HTML files
3. **Images**: Add optimized images to `assets/images/`
4. **Fonts**: Add web fonts to `assets/fonts/`

## Deployment

### Option 1: Netlify (Recommended)

1. Push to GitHub repository
2. Connect repository to Netlify
3. Set build command: (none, static site)
4. Set publish directory: `.` (root)
5. Add environment variables if using serverless functions

### Option 2: Vercel

1. Push to GitHub repository
2. Import to Vercel
3. Set framework preset: "Static Site"
4. Deploy

### Option 3: GitHub Pages

1. Push to GitHub repository
2. Go to Settings > Pages
3. Set source to "main branch"
4. Set root directory

### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Deploy: `firebase deploy`

## Copyright Protection Features

### Frontend Protection
- Right-click disabled on protected content
- Print screen key disabled
- Ctrl+S / Ctrl+P shortcuts disabled
- Dynamic watermark overlays
- Transparent image overlays

### Access Control
- Online reading only for previews
- Download requests require manual approval
- Time-limited download links
- Usage tracking capabilities
- Purpose-based access control

### PDF Protection
- Watermarked previews only
- Page-limited previews (10 pages)
- Embedded viewer with restrictions
- No direct download URLs exposed

## Performance Optimizations

- **Lighthouse Score**: Target ≥95
- **Lazy Loading**: PDFs loaded on demand
- **Minimal Dependencies**: No frameworks, vanilla JS
- **Optimized Assets**: Compressed images, minimal CSS/JS
- **Semantic HTML**: SEO-friendly markup
- **Mobile-First**: Responsive design

## Adding Serverless Functions

For production use, uncomment and configure the serverless function in `serverless/request-download.js`:

1. Deploy function to your serverless provider
2. Update form submission URL in `contact.html`
3. Set environment variables:
   - ADMIN_EMAIL
   - SENDGRID_API_KEY (or other email service)
   - ADMIN_DASHBOARD_URL

## Maintenance

### Regular Updates
1. Add new publications to `data/publications.json`
2. Upload corresponding preview PDFs
3. Update author information in `data/author.json`

### Security Considerations
- Regularly update security measures
- Monitor download requests
- Review access logs
- Update watermarks periodically

### Performance Monitoring
- Use Lighthouse for regular audits
- Monitor page load times
- Optimize images regularly
- Update dependencies if any

## License

This website template is provided for academic portfolio use. All content displayed through the website remains copyrighted by the respective authors.

## Support

For issues or questions:
1. Check browser console for errors
2. Validate JSON files
3. Ensure correct file paths
4. Check serverless function configuration

---

*Designed with attention to academic integrity, performance, and user experience.*
