// PDF Reader functionality

class PDFReader {
    constructor() {
        this.currentPublication = null;
        this.currentPage = 1;
        this.totalPages = 10; // Limited preview pages
        this.init();
    }

    async init() {
        await this.loadPublication();
        this.renderPublicationInfo();
        this.setupPDFViewer();
        this.setupEventListeners();
        this.applySecurityMeasures();
    }

    async loadPublication() {
        // Get publication ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const pubId = urlParams.get('id');

        // Try to get from session storage first
        const storedPub = sessionStorage.getItem('currentPublication');

        if (storedPub) {
            this.currentPublication = JSON.parse(storedPub);
        } else if (pubId) {
            // Fallback: load from publications data
            try {
                const response = await fetch('data/publications.json');
                const data = await response.json();
                this.currentPublication = data.publications.find(p => p.id === pubId);
            } catch (error) {
                console.error('Error loading publication:', error);
            }
        }

        if (!this.currentPublication) {
            this.showErrorMessage();
        }
    }

    renderPublicationInfo() {
        if (!this.currentPublication) return;

        // Update page title
        document.title = `${this.currentPublication.title} - Reader`;

        // Update header
        const titleElement = document.querySelector('.reader-title');
        if (titleElement) {
            titleElement.textContent = this.currentPublication.title;
        }

        // Update citation
        const citationElement = document.querySelector('.publication-citation');
        if (citationElement && this.currentPublication.journal) {
            citationElement.innerHTML = `
                <em>${this.currentPublication.journal}</em>,
                ${this.currentPublication.volume}(${this.currentPublication.issue}),
                ${this.currentPublication.pages} (${this.currentPublication.year})
            `;
        }
    }

    setupPDFViewer() {
        if (!this.currentPublication) return;

        const viewerContainer = document.querySelector('.pdf-viewer-container');
        if (!viewerContainer) return;

        // Create PDF viewer iframe
        const pdfViewer = document.createElement('iframe');
        pdfViewer.className = 'pdf-viewer';
        pdfViewer.id = 'pdf-viewer';

        // For demo purposes, we'll use a sample PDF
        // In production, this would point to your watermarked preview PDF
        pdfViewer.src = `docs/previews/${this.currentPublication.previewFile}#page=1&toolbar=0&navpanes=0&scrollbar=0`;

        // Create watermark overlay
        const watermark = document.createElement('div');
        watermark.className = 'pdf-watermark';

        const watermarkText = document.createElement('div');
        watermarkText.className = 'watermark-text';
        watermarkText.textContent = 'PREVIEW - DO NOT DISTRIBUTE';

        // Page limiter message
        const pageLimiter = document.createElement('div');
        pageLimiter.className = 'page-limiter';
        pageLimiter.innerHTML = `
            <p><strong>Preview Limited:</strong> Only pages 1-${this.totalPages} are available for preview.</p>
        `;

        // Assemble viewer
        viewerContainer.innerHTML = '';
        viewerContainer.appendChild(pdfViewer);
        viewerContainer.appendChild(watermark);
        viewerContainer.appendChild(watermarkText);
        viewerContainer.appendChild(pageLimiter);

        // Show loading state
        this.showLoadingState();

        // Hide loading state when PDF loads
        pdfViewer.onload = () => {
            this.hideLoadingState();
        };
    }

    setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigatePage(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigatePage(1));
        }

        // Request full access button
        const requestBtn = document.querySelector('.btn-request-full');
        if (requestBtn) {
            requestBtn.addEventListener('click', () => {
                if (this.currentPublication) {
                    sessionStorage.setItem('requestedPublication',
                        JSON.stringify(this.currentPublication));
                    window.location.href = 'contact.html?type=download';
                }
            });
        }

        // Listen for PDF page changes
        this.setupPageChangeListener();
    }

    setupPageChangeListener() {
        // In a real implementation, you would use PDF.js API
        // For this demo, we'll simulate page tracking
        setInterval(() => {
            this.updatePageInfo();
        }, 1000);
    }

    updatePageInfo() {
        const pageInfo = document.querySelector('.page-info');
        if (pageInfo) {
            pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }

        // Disable next button on last page
        const nextBtn = document.querySelector('.btn-next');
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= this.totalPages;
        }

        // Disable prev button on first page
        const prevBtn = document.querySelector('.btn-prev');
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
    }

    navigatePage(direction) {
        const newPage = this.currentPage + direction;

        if (newPage < 1 || newPage > this.totalPages) {
            return;
        }

        this.currentPage = newPage;

        // Update PDF viewer to show new page
        const pdfViewer = document.getElementById('pdf-viewer');
        if (pdfViewer) {
            const currentSrc = pdfViewer.src.split('#')[0];
            pdfViewer.src = `${currentSrc}#page=${newPage}&toolbar=0&navpanes=0&scrollbar=0`;
        }

        this.updatePageInfo();
    }

    applySecurityMeasures() {
        // Additional security for reader page
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('keydown', (e) => {
            // Disable Ctrl+S, Ctrl+P
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
                e.preventDefault();
                alert('This document is protected. Please use the request form for download access.');
                return false;
            }

            // Disable Print Screen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                alert('Screenshots are disabled for protected content.');
                return false;
            }
        });

        // Prevent iframe content access
        window.addEventListener('blur', () => {
            if (document.activeElement.tagName === 'IFRAME') {
                alert('Interacting with the document viewer is restricted.');
            }
        });
    }

    showLoadingState() {
        const container = document.querySelector('.pdf-viewer-container');
        if (container) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'pdf-loading';
            loadingDiv.innerHTML = `
                <div class="spinner"></div>
                <p>Loading document preview...</p>
            `;
            container.appendChild(loadingDiv);
        }
    }

    hideLoadingState() {
        const loadingDiv = document.querySelector('.pdf-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showErrorMessage() {
        const container = document.querySelector('.reader-container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <h2>Publication Not Found</h2>
                    <p>The requested publication could not be loaded.</p>
                    <a href="publications.html" class="btn">Back to Publications</a>
                </div>
            `;
        }
    }
}

// Initialize reader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pdfReader = new PDFReader();
    window.pdfReader = pdfReader;
});
