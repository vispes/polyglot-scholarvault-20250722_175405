# Polyglot ScholarVault - Academic Translation System

![System Architecture Diagram](https://via.placeholder.com/800x400?text=Translation+Workflow+Diagram) *Diagram showing Polyglot ScholarVault architecture*

## Project Overview
Polyglot ScholarVault is an AI-powered academic translation platform designed for researchers and academics. It provides seamless translation of academic PDFs while preserving formatting, citations, and context with specialized features for scholarly content management. The system combines OCR, machine translation, citation formatting, and version control in a unified interface.

**Key Features**:
- Multi-language PDF translation with formatting preservation
- Side-by-side translation editor with scroll synchronization
- Smart citation engine (APA/MLA/Chicago) with source validation
- Document version history with semantic diff visualization
- Google Docs integration with real-time syncing
- End-to-end document encryption

## Technology Stack
**Frontend**: 
- React 18 + TypeScript
- Zustand state management
- PDF.js + Tesseract.js
- Google Docs API

**Backend Services**:
- Node.js with Express
- Translation APIs (Google Translate, DeepL)
- Citation validation services (CrossRef)
- Encryption: AES-256

## Installation
```bash
# Clone repository
git clone https://github.com/your-org/polyglot-scholarvault-20250722_175405.git
cd polyglot-scholarvault-20250722_175405

# Install dependencies
npm install

# Configure environment variables (create .env file)
cp .env.example .env

# Start development server
npm start
```

**.env Configuration**:
```
REACT_APP_GOOGLE_API_KEY=your_google_api_key
REACT_APP_DEEPL_API_KEY=your_deepl_api_key
REACT_APP_OPENAI_API_KEY=your_openai_key
REACT_APP_CRYPTO_SECRET=your_encryption_secret
```

## Key Components
| Component | Description | Dependencies |
|-----------|-------------|--------------|
| **PDFUploader.tsx** | PDF upload interface with validation and OCR | pdfprocessor.ts |
| **SplitView.tsx** | Side-by-side comparison of original/translated content | usetranslationstore |
| **TranslationManager.tsx** | Control panel for translation pipelines | translationorchestrator |
| **VersionComparator.tsx** | AI-powered semantic diff across versions | citationengine |
| **GoogleDocsPreview.tsx** | Live preview with embedded Google Docs | docsCompiler |
| **CitationConfigurator.tsx** | Style-formatted citation generator | citationengine |
| **LanguageSelector.tsx** | Multi-language selection UI | usetranslationstore |
| **PageEditor.tsx** | Per-page content editor with snapshots | SplitView |
| **pdfprocessor.ts** | PDF text extraction & page management | Tesseract.js |
| **encryptionservice.ts** | AES-256 document encryption | crypto-js |

## Getting Started
**Basic Translation Workflow**:
```javascript
// Sample translation process
import { encryptDocument } from './services/encryptionservice';
import { extractTextFromPdf } from './services/pdfprocessor';
import { orchestrateTranslation } from './services/translationorchestrator';

async function translateDocument(file, targetLang) {
  // 1. Secure document
  const encryptedDoc = await encryptDocument(file);
  
  // 2. Extract and process text
  const { pages } = await extractTextFromPdf(encryptedDoc);
  
  // 3. Perform translation
  const translationResults = await orchestrateTranslation({
    pages,
    sourceLang: 'auto',
    targetLang,
    translationMode: 'academic'
  });
  
  return translationResults;
}
```

## Dependencies
**Main Production Dependencies**:
```json
"dependencies": {
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "zustand": "^4.4.1",
  "pdfjs-dist": "^3.4.120",
  "tesseract.js": "^4.0.2",
  "crypto-js": "^4.1.1",
  "diff": "^5.1.0",
  "react-google-docs-viewer": "^3.0.5"
}
```

**Development Dependencies**:
```json
"devDependencies": {
  "typescript": "^5.0.4",
  "vite": "^4.4.5",
  "@testing-library/react": "^14.0.0",
  "msw": "^1.3.0"
}
```

## Security Features
1. **Document Encryption**
   - AES-256 encryption for storage and transmission
   - Secure key management through environment variables
2. **Authentication**
   - JWT-based access control
   - Role-Based Access Control (RBAC) middleware
3. **Data Validation**
   - Strict input validation for API endpoints
   - Content sanitization for user-generated content

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/your-feature`)
3. Commit changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Push to branch and open pull request

## License
MIT License - See [LICENSE.md](LICENSE.md) for details