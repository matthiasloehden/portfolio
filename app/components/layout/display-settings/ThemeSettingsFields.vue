<script setup lang="ts">
import { THEME_BODY_FONTS, THEME_COLOR_CONTROLS, THEME_DISPLAY_FONTS, getThemePreset } from '@/config/themes';
import type {
  ThemeBodyFontId,
  ThemeColorToken,
  ThemeDisplayFontId,
  ThemeMode,
  ThemePalette,
  ThemeSettings,
} from '@/types/theme';
import SharedAccordion from '@/components/shared/Accordion.vue';
import SharedAccordionGroup from '@/components/shared/AccordionGroup.vue';
import SharedHexColorInput from '@/components/shared/form/HexColorInput.vue';
import SharedSelectField from '@/components/shared/form/SelectField.vue';

const props = defineProps<{
  settings: ThemeSettings;
  mode: ThemeMode;
  values: ThemePalette;
}>();

const emit = defineEmits<{
  'display-font-change': [font: ThemeDisplayFontId];
  'body-font-change': [font: ThemeBodyFontId];
  'color-change': [token: ThemeColorToken, color: string];
  'color-reset': [token: ThemeColorToken];
  reset: [];
}>();

const displayFontOptions = THEME_DISPLAY_FONTS.map(({ id, label }) => ({ value: id, label }));
const bodyFontOptions = THEME_BODY_FONTS.map(({ id, label }) => ({ value: id, label }));
const colorGroups = [
  { key: 'canvas', label: 'Canvas & surfaces' },
  { key: 'text', label: 'Text' },
  { key: 'accent', label: 'Accents & states' },
] as const;

const groupedControls = colorGroups.map((group) => ({
  ...group,
  controls: THEME_COLOR_CONTROLS.filter((control) => control.group === group.key),
}));
const selectedPreset = computed(() => getThemePreset(props.settings.preset));

function onDisplayFontChange(font: ThemeDisplayFontId): void {
  emit('display-font-change', font);
}

function onBodyFontChange(font: ThemeBodyFontId): void {
  emit('body-font-change', font);
}
</script>

<template>
  <div>
    <SharedSelectField
      label="Heading font"
      :model-value="settings.fonts.display"
      :options="displayFontOptions"
      @update:model-value="onDisplayFontChange"
    />
    <SharedSelectField
      class="mt-3"
      label="Body font"
      :model-value="settings.fonts.body"
      :options="bodyFontOptions"
      @update:model-value="onBodyFontChange"
    />

    <div class="mt-4 flex items-start justify-between gap-3 border-y border-line py-3 font-mono">
      <span>
        <span class="block text-[0.62rem] font-semibold text-foreground">Custom colors</span>
        <span class="mt-0.5 block text-[0.54rem] leading-[1.4] text-muted">
          Editing {{ mode }}. Overrides stay active when presets change.
        </span>
      </span>
      <span class="mt-0.5 shrink-0 text-[0.52rem] tracking-[0.08em] text-primary-bright uppercase">
        {{ selectedPreset.label }}
      </span>
    </div>

    <SharedAccordionGroup :end-border="false">
      <SharedAccordion
        v-for="group in groupedControls"
        :key="group.key"
        :label="group.label"
      >
        <div class="grid gap-4">
          <SharedHexColorInput
            v-for="control in group.controls"
            :key="control.key"
            :label="control.label"
            :description="control.description"
            :model-value="values[control.key]"
            :overridden="settings.colorOverrides[mode][control.key] !== undefined"
            :reset-label="`Use ${selectedPreset.label} ${mode} value`"
            @update:model-value="emit('color-change', control.key, $event)"
            @reset="emit('color-reset', control.key)"
          />
        </div>
      </SharedAccordion>
    </SharedAccordionGroup>

    <button
      class="mt-4 w-full cursor-pointer border border-line px-3 py-2 font-mono text-[0.56rem] text-muted transition-colors hover:border-line-strong hover:text-foreground focus-visible:border-line-strong focus-visible:text-foreground"
      type="button"
      @click="emit('reset')"
    >
      Reset theme customizations
    </button>
  </div>
</template>
