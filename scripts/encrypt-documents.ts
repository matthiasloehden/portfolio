import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Encrypter } from 'age-encryption';
import { PROTECTED_DOCUMENTS } from '../app/config/protected-documents.ts';

const password = process.env.DOCUMENT_PASSWORD;

if (!password) {
  throw new Error('DOCUMENT_PASSWORD is missing. Create .env.documents before encrypting documents.');
}

for (const document of Object.values(PROTECTED_DOCUMENTS)) {
  const sourcePath = resolve(process.cwd(), 'private-documents', document.downloadFileName);
  const targetPath = resolve(process.cwd(), 'public', document.encryptedFilePath);
  const plaintext = new Uint8Array(await readFile(sourcePath));

  const encrypter = new Encrypter();
  encrypter.setPassphrase(password);

  const encrypted = await encrypter.encrypt(plaintext);

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, encrypted);

  process.stdout.write(`Encrypted ${document.downloadFileName}\n`);
}
