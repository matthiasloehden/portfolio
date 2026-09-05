<script setup lang="ts">
import { onMounted } from 'vue';
import { PROTECTED_DOCUMENTS, isProtectedDocumentSlug } from '@/config/protected-documents';
import { APP_ROUTE_PATHS } from '@/config/routes';

definePageMeta({
  layout: false,
  i18n: false,
});

useSeoMeta({
  title: 'Geschütztes Dokument',
  robots: 'noindex, nofollow, noarchive, nosnippet',
});

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

function redirectHome() {
  return navigateTo(APP_ROUTE_PATHS.index, { replace: true });
}

function getPublicAssetUrl(path: string) {
  const baseURL = runtimeConfig.app.baseURL.replace(/\/$/, '');
  return `${baseURL}/${path}`;
}

onMounted(async () => {
  const routeParameter = route.params.document;
  const slug = Array.isArray(routeParameter) ? routeParameter[0] : routeParameter;

  if (!slug || !isProtectedDocumentSlug(slug)) {
    await redirectHome();
    return;
  }

  const protectedDocument = PROTECTED_DOCUMENTS[slug];
  const password = window.prompt('Passwort für das Dokument eingeben:');

  if (password === null || password.length === 0) {
    await redirectHome();
    return;
  }

  let encryptedBytes: Uint8Array;

  try {
    const response = await fetch(getPublicAssetUrl(protectedDocument.encryptedFilePath), {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to load protected document: ${response.status}`);
    }

    encryptedBytes = new Uint8Array(await response.arrayBuffer());
  } catch {
    window.alert('Das Dokument konnte nicht geladen werden.');
    await redirectHome();
    return;
  }

  try {
    const { Decrypter } = await import('age-encryption');
    const decrypter = new Decrypter();
    decrypter.addPassphrase(password);
    const decrypted = await decrypter.decrypt(encryptedBytes);
    const pdfBytes = Uint8Array.from(decrypted);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = objectUrl;
    anchor.download = protectedDocument.downloadFileName;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

    await redirectHome();
  } catch {
    window.alert('Passwort falsch oder Dokument konnte nicht entschlüsselt werden.');
    await redirectHome();
  }
});
</script>

<template>
  <div />
</template>
