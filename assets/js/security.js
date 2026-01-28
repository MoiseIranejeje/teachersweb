// Basic frontend security measures

class SecurityManager {
    constructor() {
        this.init();
    }

    init() {
        this.disableRightClick();
        this.downloadShortcuts();
        this.preventPrinting();
        this.addWatermarkObserver();
        this.protectImages();
    }

    disableRightClick() {
        document.addEventListener('contextmenu', (e) => {
            // Allow right-click on forms and inputs for better UX
            if (e.target.tagName === 'INPUT' ||
                e.target.tagName === 'TEXTAREA' ||
                e.target.isContentEditable) {
                return;
            }

            e.preventDefault();
            this.showProtectionNotice('Right-click is disabled to protect content.');
            return false;
        });
    }

    downloadShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Disable Ctrl+S, Ctrl+Shift+S, Cmd+S
            if ((e.ctrlKey || e.metaKey) &&
                (e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                this.showProtectionNotice('Please use the request form for download access.');
                return false;
            }

            // Disable Print Screen
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                this.showProtectionNotice('Screenshots are restricted.');
                return false;
            }
        });
    }

    preventPrinting() {
        // Add print styles
        const printStyle = document.createElement('style');
        printStyle.innerHTML = `
            @media print {
                body * {
                    visibility: hidden;
                }
                .print-message, .print-message * {
                    visibility: visible;
                }
                .print-message {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 2rem;
                }
            }
        `;
        document.head.appendChild(printStyle);

        // Add print message container
        const printMessage = document.createElement('div');
        printMessage.className = 'print-message';
        printMessage.style.cssText = 'display: none;';
        printMessage.innerHTML = `
            <h2>Content Protection</h2>
            <p>Printing is disabled for copyright protection.</p>
            <p>To request a copy, please use the contact form.</p>
            <p><a href="contact.html">Request Access</a></p>
        `;
        document.body.appendChild(printMessage);

        // Show message before print
        window.addEventListener('beforeprint', () => {
            printMessage.style.display = 'block';
        });

        window.addEventListener('afterprint', () => {
            printMessage.style.display = 'none';
        });
    }

    addWatermarkObserver() {
        // Add watermark to images dynamically
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeName === 'IMG') {
                            this.addImageWatermark(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Process existing images
        document.querySelectorAll('img').forEach(img => {
            this.addImageWatermark(img);
        });
    }

    addImageWatermark(img) {
        // Skip if already watermarked
        if (img.classList.contains('watermarked')) return;

        // Create watermark overlay
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';

        img.parentNode.insertBefore(container, img);
        container.appendChild(img);

        const watermark = document.createElement('div');
        watermark.style.position = 'absolute';
        watermark.style.top = '0';
        watermark.style.left = '0';
        watermark.style.width = '100%';
        watermark.style.height = '100%';
        watermark.style.background = 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 20px)';
        watermark.style.pointerEvents = 'none';

        container.appendChild(watermark);
        img.classList.add('watermarked');
    }

    protectImages() {
        // Prevent dragging images
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });

        // Add transparent overlay to prevent direct image access
        document.querySelectorAll('img').forEach(img => {
            img.style.pointerEvents = 'none';
            img.style.userSelect = 'none';
            img.style.webkitUserSelect = 'none';
        });
    }

    showProtectionNotice(message) {
        // Create notification
        const notice = document.createElement('div');
        notice.className = 'protection-notice';
        notice.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        notice.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">⚠️</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notice);

        // Remove after 3 seconds
        setTimeout(() => {
            notice.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notice.remove(), 300);
        }, 3000);
    }

    // Additional method for AJAX request protection
    static addCSRFToken(xhr) {
        // Add CSRF token for forms if using server-side
        const token = SecurityManager.getCSRFToken();
        if (token) {
            xhr.setRequestHeader('X-CSRF-Token', token);
        }
    }

    static getCSRFToken() {
        // Get token from meta tag or cookie
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? meta.getAttribute('content') : null;
    }
}

// Initialize security when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SecurityManager();
});
