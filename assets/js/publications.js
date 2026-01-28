// Publications data handling and display

class PublicationsManager {
    constructor() {
        this.publications = [];
        this.filteredPublications = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        await this.loadPublications();
        this.renderPublications();
        this.setupEventListeners();
    }

    async loadPublications() {
        try {
            const response = await fetch('data/publications.json');
            const data = await response.json();
            this.publications = data.publications;
            this.filteredPublications = [...this.publications];
        } catch (error) {
            console.error('Error loading publications:', error);
            this.showErrorMessage();
        }
    }

    renderPublications(containerSelector = '.publications-grid') {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        container.innerHTML = '';

        if (this.filteredPublications.length === 0) {
            container.innerHTML = '<p class="no-results">No publications found.</p>';
            return;
        }

        this.filteredPublications.forEach(pub => {
            const card = this.createPublicationCard(pub);
            container.appendChild(card);
        });

        // Trigger animations
        setTimeout(() => {
            document.querySelectorAll('.publication-card').forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, index * 100);
            });
        }, 100);
    }

    createPublicationCard(publication) {
        const card = document.createElement('article');
        card.className = 'publication-card';
        card.dataset.id = publication.id;
        card.dataset.category = publication.category.toLowerCase().replace(' ', '-');

        const authors = Array.isArray(publication.authors) ?
            publication.authors.join(', ') : publication.authors;

        const citation = this.formatCitation(publication);

        card.innerHTML = `
            <h3 class="publication-title">${publication.title}</h3>
            <div class="publication-meta">
                <span class="publication-authors">${authors}</span>
                <span class="publication-year">${publication.year}</span>
            </div>
            <div class="publication-citation">${citation}</div>
            <p class="publication-abstract">${publication.abstract}</p>
            <div class="publication-tags">
                ${publication.keywords.map(keyword =>
                    `<span class="tag">${keyword}</span>`
                ).join('')}
            </div>
            <div class="publication-actions">
                <button class="btn btn-sm btn-read" data-id="${publication.id}">
                    Read Online
                </button>
                ${publication.downloadRequestable ? `
                    <button class="btn btn-sm btn-outline btn-request" data-id="${publication.id}">
                        Request Download
                    </button>
                ` : ''}
            </div>
        `;

        return card;
    }

    formatCitation(publication) {
        let citation = '';

        if (publication.journal) {
            citation = `<em>${publication.journal}</em>, ${publication.volume}(${publication.issue}), ${publication.pages}`;
        } else if (publication.book) {
            citation = `In <em>${publication.book}</em> (pp. ${publication.pages}). ${publication.publisher}`;
        }

        return citation;
    }

    setupEventListeners() {
        // Read online button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-read')) {
                const pubId = e.target.dataset.id;
                this.openReader(pubId);
            }

            if (e.target.classList.contains('btn-request')) {
                const pubId = e.target.dataset.id;
                this.requestDownload(pubId);
            }
        });

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterPublications(filter);

                // Update active filter button
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Search input
        const searchInput = document.querySelector('.publications-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPublications(e.target.value);
            });
        }
    }

    filterPublications(filter) {
        this.currentFilter = filter;

        if (filter === 'all') {
            this.filteredPublications = [...this.publications];
        } else {
            this.filteredPublications = this.publications.filter(pub =>
                pub.category.toLowerCase().includes(filter) ||
                pub.year.toString() === filter
            );
        }

        this.renderPublications();
    }

    searchPublications(query) {
        if (!query.trim()) {
            this.filteredPublications = [...this.publications];
        } else {
            const searchTerm = query.toLowerCase();
            this.filteredPublications = this.publications.filter(pub =>
                pub.title.toLowerCase().includes(searchTerm) ||
                pub.abstract.toLowerCase().includes(searchTerm) ||
                pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm)) ||
                pub.authors.some(author => author.toLowerCase().includes(searchTerm))
            );
        }

        this.renderPublications();
    }

    openReader(pubId) {
        const publication = this.publications.find(p => p.id === pubId);
        if (!publication) return;

        // Store publication data for reader page
        sessionStorage.setItem('currentPublication', JSON.stringify(publication));

        // Navigate to reader
        window.location.href = `reader.html?id=${pubId}`;
    }

    requestDownload(pubId) {
        const publication = this.publications.find(p => p.id === pubId);
        if (!publication) return;

        // Store requested publication and redirect to contact form
        sessionStorage.setItem('requestedPublication', JSON.stringify(publication));
        window.location.href = 'contact.html?type=download';
    }

    showErrorMessage() {
        const containers = document.querySelectorAll('.publications-grid');
        containers.forEach(container => {
            container.innerHTML = `
                <div class="error-message">
                    <p>Unable to load publications. Please try again later.</p>
                </div>
            `;
        });
    }

    // Method for featured publications on home page
    renderFeaturedPublications() {
        const featured = this.publications.filter(pub => pub.featured);
        const container = document.getElementById('featured-publications');

        if (!container) return;

        container.innerHTML = '';
        featured.slice(0, 3).forEach(pub => {
            const card = this.createPublicationCard(pub);
            container.appendChild(card);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const publicationsManager = new PublicationsManager();

    // Expose to window for debugging if needed
    window.publicationsManager = publicationsManager;
});
