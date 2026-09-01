<script setup lang="ts">
import type { LanguagePreference, SupportedLocale } from '@/config/locales';
import { AUTOMATIC_LOCALE, getLocaleDefinition, isSupportedLocale, LOCALE_DEFINITIONS } from '@/config/locales';
import SharedSelectField from '@/components/shared/form/SelectField.vue';
import LanguageQualityIndicator from './LanguageQualityIndicator.vue';

const props = defineProps<{
  modelValue: LanguagePreference;
  automaticLocale: SupportedLocale;
}>();
const emit = defineEmits<{
  'update:modelValue': [preference: LanguagePreference];
}>();
const { t } = useI18n();

const options = computed<readonly { value: LanguagePreference; label: string }[]>(() => [
  { value: AUTOMATIC_LOCALE, label: t('display.language.automatic') },
  ...LOCALE_DEFINITIONS.map(({ code, name }) => ({ value: code, label: name })),
]);
const automaticLocaleName = computed(() => getLocaleDefinition(props.automaticLocale).name);

function getQualityLabel(locale: SupportedLocale): string {
  return t(
    getLocaleDefinition(locale).quality === 'recommended'
      ? 'display.language.recommended'
      : 'display.language.machineTranslated',
  );
}
</script>

<template>
  <SharedSelectField
    :label="t('display.language.label')"
    :description="t('display.language.description')"
    :meta="modelValue === AUTOMATIC_LOCALE ? automaticLocaleName : undefined"
    :model-value="modelValue"
    :options="options"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <template #value-indicator="{ option }">
      <LanguageQualityIndicator
        v-if="option && isSupportedLocale(option.value)"
        :quality="getLocaleDefinition(option.value).quality"
        :label="getQualityLabel(option.value)"
      />
    </template>

    <template #option-indicator="{ option }">
      <LanguageQualityIndicator
        v-if="isSupportedLocale(option.value)"
        :quality="getLocaleDefinition(option.value).quality"
        :label="getQualityLabel(option.value)"
      />
    </template>
  </SharedSelectField>
</template>
