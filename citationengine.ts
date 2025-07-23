const requiredFields: Record<SourceType, (keyof SourceData)[]> = {
    book: ['title', 'authors', 'publicationYear', 'publisher'],
    journal: ['title', 'authors', 'publicationYear', 'journal'],
    website: ['title', 'authors', 'publicationYear', 'url'],
    other: ['title', 'authors', 'publicationYear'],
};

export function validateSource(source: SourceData): boolean {
    const fields = requiredFields[source.type] || requiredFields.other;
    return fields.every(field => {
        const value = source[field];
        if (field === 'authors') {
            return Array.isArray(value) && value.length > 0;
        }
        return value !== undefined && value !== '';
    });
}

function formatAuthorsAPA(authors: Author[]): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) {
        return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}.`;
    }
    if (authors.length === 2) {
        return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}., & ${authors[1].lastName}, ${authors[1].firstName.charAt(0)}.`;
    }
    return `${authors[0].lastName}, ${authors[0].firstName.charAt(0)}. et al.`;
}

function formatAuthorsMLA(authors: Author[]): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) {
        return `${authors[0].lastName}, ${authors[0].firstName}`;
    }
    if (authors.length === 2) {
        return `${authors[0].lastName}, ${authors[0].firstName} and ${authors[1].firstName} ${authors[1].lastName}`;
    }
    return `${authors[0].lastName}, ${authors[0].firstName}, et al.`;
}

function formatAuthorsChicago(authors: Author[]): string {
    if (authors.length === 0) return '';
    if (authors.length === 1) {
        return `${authors[0].lastName}, ${authors[0].firstName}`;
    }
    if (authors.length === 2) {
        return `${authors[0].lastName}, ${authors[0].firstName} and ${authors[1].firstName} ${authors[1].lastName}`;
    }
    return `${authors[0].lastName}, ${authors[0].firstName}, et al.`;
}

function formatAPADate(date?: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function formatChicagoDate(date?: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatAPA(source: SourceData): string {
    if (!validateSource(source)) return 'Invalid source data';
    
    switch (source.type) {
        case 'book':
            return `${formatAuthorsAPA(source.authors)} (${source.publicationYear}). ${source.title}. ${source.publisher}.`;
            
        case 'journal': {
            const pageString = source.pages ? source.pages : '';
            return `${formatAuthorsAPA(source.authors)} (${source.publicationYear}). ${source.title}. ${source.journal}, ${source.volume || ''}${source.issue ? `(${source.issue})` : ''}, ${pageString}.`;
        }
            
        case 'website':
            const accessPart = source.accessedDate && source.publicationYear === 'n.d.' 
                ? ` Retrieved ${formatAPADate(source.accessedDate)}${source.url ? `, from ${source.url}` : ''}` 
                : (source.url ? ` ${source.url}` : '');
            return `${formatAuthorsAPA(source.authors)} (${source.publicationYear}). ${source.title}.${source.publisher ? ` ${source.publisher}.` : ''}${accessPart}${accessPart ? '.' : ''}`;
            
        default:
            return `${formatAuthorsAPA(source.authors)} (${source.publicationYear}). ${source.title}.`;
    }
}

export function formatMLA(source: SourceData): string {
    if (!validateSource(source)) return 'Invalid source data';
    
    switch (source.type) {
        case 'book':
            return `${formatAuthorsMLA(source.authors)}. ${source.title}. ${source.publisher}, ${source.publicationYear}.`;
            
        case 'journal': {
            const volumeIssue = [source.volume, source.issue].filter(Boolean).join('.');
            return `${formatAuthorsMLA(source.authors)}. "${source.title}." ${source.journal}${volumeIssue ? `, vol. ${volumeIssue}` : ''}${source.pages ? `, pp. ${source.pages}` : ''}, ${source.publicationYear}.`;
        }
            
        case 'website': {
            const dateAccessed = source.accessedDate 
                ? ` Accessed ${new Date(source.accessedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}.` 
                : '';
            return `${formatAuthorsMLA(source.authors)}. "${source.title}." ${source.publisher || 'Website'}, ${source.publicationYear}${source.url ? `, ${source.url}` : ''}.${dateAccessed}`;
        }
            
        default:
            return `${formatAuthorsMLA(source.authors)}. ${source.title}. ${source.publicationYear}.`;
    }
}

export function formatChicago(source: SourceData): string {
    if (!validateSource(source)) return 'Invalid source data';
    
    switch (source.type) {
        case 'book':
            const place = source.city ? `${source.city}: ` : '';
            return `${formatAuthorsChicago(source.authors)}. ${source.title}. ${place}${source.publisher}, ${source.publicationYear}.`;
            
        case 'journal': {
            const volumeIssue = [source.volume, source.issue].filter(Boolean).join('.');
            return `${formatAuthorsChicago(source.authors)}. "${source.title}." ${source.journal}${volumeIssue ? ` ${volumeIssue}` : ''} (${source.publicationYear})${source.pages ? `: ${source.pages}.` : '.'}`;
        }
            
        case 'website': {
            const accessDate = source.accessedDate ? ` Accessed ${formatChicagoDate(source.accessedDate)}.` : '';
            return `${formatAuthorsChicago(source.authors)}. "${source.title}." ${source.publisher || 'Website'}. ${source.publicationYear}. ${source.url || ''}.${accessDate}`;
        }
            
        default:
            return `${formatAuthorsChicago(source.authors)}. ${source.title}. ${source.publicationYear}.`;
    }
}