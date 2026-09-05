export const PROTECTED_DOCUMENTS = {
  lebenslauf: {
    routePath: '/files/lebenslauf',
    encryptedFilePath: 'protected-documents/lebenslauf.age',
    downloadFileName: 'Lebenslauf.pdf',
  },
  anschreiben: {
    routePath: '/files/anschreiben',
    encryptedFilePath: 'protected-documents/anschreiben.age',
    downloadFileName: 'Anschreiben.pdf',
  },
} as const;

export type ProtectedDocumentSlug = keyof typeof PROTECTED_DOCUMENTS;

export const PROTECTED_DOCUMENT_ROUTE_PATHS = Object.values(PROTECTED_DOCUMENTS).map(({ routePath }) => routePath);

export function isProtectedDocumentSlug(value: string): value is ProtectedDocumentSlug {
  return Object.hasOwn(PROTECTED_DOCUMENTS, value);
}
