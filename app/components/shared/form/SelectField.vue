<script setup lang="ts" generic="Value extends string">
import type { CSSProperties } from 'vue';

interface SelectFieldOption<OptionValue extends string> {
  value: OptionValue;
  label: string;
}

const props = defineProps<{
  label: string;
  meta?: string;
  description?: string;
  modelValue: Value;
  options: readonly SelectFieldOption<Value>[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Value];
}>();

defineSlots<{
  value(props: { option: SelectFieldOption<Value> | undefined }): unknown;
  option(props: { option: SelectFieldOption<Value>; selected: boolean; active: boolean }): unknown;
}>();

const TYPEAHEAD_DELAY = 500;
const PAGE_SIZE = 10;
const MAX_VISIBLE_OPTIONS = 7;
const VIEWPORT_MARGIN = 8;
const LISTBOX_GAP = 4;

const root = ref<HTMLElement | null>(null);
const trigger = ref<HTMLButtonElement | null>(null);
const listbox = ref<HTMLElement | null>(null);
const optionElements = ref<HTMLElement[]>([]);
const descriptionId = useId();
const labelId = useId();
const triggerId = useId();
const listboxId = useId();
const open = ref(false);
const activeIndex = ref(-1);
const listboxPosition = ref<CSSProperties>({ visibility: 'hidden' });
let typeaheadQuery = '';
let typeaheadTimeout: ReturnType<typeof setTimeout> | undefined;
let positionFrame: number | undefined;

const selectedOption = computed(() => props.options.find((option) => option.value === props.modelValue));
const selectedIndex = computed(() => props.options.findIndex((option) => option.value === props.modelValue));

function getOptionId(index: number): string {
  return `${listboxId}-option-${index}`;
}

function setOptionElement(element: unknown, index: number): void {
  if (element instanceof HTMLElement) optionElements.value[index] = element;
}

function revealActiveOption(): void {
  nextTick(() => optionElements.value[activeIndex.value]?.scrollIntoView({ block: 'nearest' }));
}

function toPixels(value: string): number {
  return Number.parseFloat(value) || 0;
}

function getListboxHeightLimit(element: HTMLElement): number {
  const styles = getComputedStyle(element);
  const visibleOptions = optionElements.value.slice(0, MAX_VISIBLE_OPTIONS);
  const optionsHeight = visibleOptions.reduce((height, option) => height + option.getBoundingClientRect().height, 0);
  const gapsHeight = Math.max(0, visibleOptions.length - 1) * toPixels(styles.rowGap);
  const chromeHeight =
    toPixels(styles.paddingTop) +
    toPixels(styles.paddingBottom) +
    toPixels(styles.borderTopWidth) +
    toPixels(styles.borderBottomWidth);

  return Math.ceil(optionsHeight + gapsHeight + chromeHeight);
}

function updateListboxPosition(): void {
  const triggerElement = trigger.value;
  const listboxElement = listbox.value;
  if (!open.value || !triggerElement || !listboxElement) return;

  const triggerBounds = triggerElement.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = document.documentElement.clientHeight;
  const width = Math.min(triggerBounds.width, viewportWidth - VIEWPORT_MARGIN * 2);
  const left = Math.min(Math.max(VIEWPORT_MARGIN, triggerBounds.left), viewportWidth - VIEWPORT_MARGIN - width);
  const spaceBelow = viewportHeight - triggerBounds.bottom - LISTBOX_GAP - VIEWPORT_MARGIN;
  const spaceAbove = triggerBounds.top - LISTBOX_GAP - VIEWPORT_MARGIN;
  const styles = getComputedStyle(listboxElement);
  const heightLimit = getListboxHeightLimit(listboxElement);
  const fullHeight = listboxElement.scrollHeight + toPixels(styles.borderTopWidth) + toPixels(styles.borderBottomWidth);
  const preferredHeight = Math.min(fullHeight, heightLimit);
  const opensAbove = spaceBelow < preferredHeight && spaceAbove > spaceBelow;
  const availableHeight = Math.max(0, opensAbove ? spaceAbove : spaceBelow);
  const maxHeight = Math.min(heightLimit, availableHeight);
  const renderedHeight = Math.min(fullHeight, maxHeight);
  const top = opensAbove
    ? Math.max(VIEWPORT_MARGIN, triggerBounds.top - LISTBOX_GAP - renderedHeight)
    : triggerBounds.bottom + LISTBOX_GAP;

  listboxPosition.value = {
    top: `${Math.round(top)}px`,
    left: `${Math.round(left)}px`,
    width: `${Math.round(width)}px`,
    maxHeight: `${Math.floor(maxHeight)}px`,
    transformOrigin: opensAbove ? 'bottom' : 'top',
    visibility: 'visible',
  };
}

function scheduleListboxPositionUpdate(): void {
  if (!open.value || positionFrame !== undefined) return;

  positionFrame = requestAnimationFrame(() => {
    positionFrame = undefined;
    updateListboxPosition();
  });
}

function resetTypeahead(): void {
  typeaheadQuery = '';
  if (typeaheadTimeout !== undefined) clearTimeout(typeaheadTimeout);
  typeaheadTimeout = undefined;
}

function openListbox(): void {
  if (props.disabled || props.options.length === 0 || open.value) return;

  activeIndex.value = selectedIndex.value >= 0 ? selectedIndex.value : 0;
  listboxPosition.value = { visibility: 'hidden' };
  open.value = true;
  nextTick(() => {
    updateListboxPosition();
    optionElements.value[activeIndex.value]?.scrollIntoView({ block: 'nearest' });
  });
}

function closeListbox(): void {
  open.value = false;
  activeIndex.value = -1;
  resetTypeahead();
}

function commitOption(index: number, restoreFocus = true): void {
  const option = props.options[index];
  if (!option) return;

  if (option.value !== props.modelValue) emit('update:modelValue', option.value);
  closeListbox();

  if (restoreFocus) nextTick(() => trigger.value?.focus({ preventScroll: true }));
}

function setActiveOption(index: number): void {
  if (props.options.length === 0) return;

  activeIndex.value = Math.min(props.options.length - 1, Math.max(0, index));
  revealActiveOption();
}

function findTypeaheadMatch(query: string): number {
  const normalizedQuery = query.toLocaleLowerCase();
  const startIndex = activeIndex.value >= 0 ? activeIndex.value + 1 : 0;

  for (let offset = 0; offset < props.options.length; offset += 1) {
    const index = (startIndex + offset) % props.options.length;
    if (props.options[index]?.label.toLocaleLowerCase().startsWith(normalizedQuery)) return index;
  }

  return -1;
}

function handleTypeahead(character: string): void {
  if (!open.value) openListbox();

  if (typeaheadTimeout !== undefined) clearTimeout(typeaheadTimeout);
  typeaheadQuery += character.toLocaleLowerCase();
  typeaheadTimeout = setTimeout(resetTypeahead, TYPEAHEAD_DELAY);

  const repeatedCharacter = [...typeaheadQuery].every((letter) => letter === typeaheadQuery[0]);
  const query = repeatedCharacter ? character.toLocaleLowerCase() : typeaheadQuery;
  const matchIndex = findTypeaheadMatch(query);

  if (matchIndex >= 0) setActiveOption(matchIndex);
  else resetTypeahead();
}

function isTypeaheadKey(event: KeyboardEvent): boolean {
  return event.key.length === 1 && event.key !== ' ' && !event.altKey && !event.ctrlKey && !event.metaKey;
}

function onTriggerClick(): void {
  if (open.value) closeListbox();
  else openListbox();
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (props.disabled || props.options.length === 0) return;

  if (!open.value) {
    if (['ArrowDown', 'Enter', ' '].includes(event.key) || (event.altKey && event.key === 'ArrowDown')) {
      event.preventDefault();
      openListbox();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      openListbox();
      setActiveOption(0);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      openListbox();
      setActiveOption(event.key === 'Home' ? 0 : props.options.length - 1);
    } else if (isTypeaheadKey(event)) {
      event.preventDefault();
      handleTypeahead(event.key);
    }
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setActiveOption(activeIndex.value + 1);
  } else if (event.key === 'ArrowUp' && event.altKey) {
    event.preventDefault();
    commitOption(activeIndex.value);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setActiveOption(activeIndex.value - 1);
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    setActiveOption(event.key === 'Home' ? 0 : props.options.length - 1);
  } else if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault();
    setActiveOption(activeIndex.value + (event.key === 'PageUp' ? -PAGE_SIZE : PAGE_SIZE));
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    commitOption(activeIndex.value);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeListbox();
  } else if (event.key === 'Tab') {
    commitOption(activeIndex.value, false);
  } else if (isTypeaheadKey(event)) {
    event.preventDefault();
    handleTypeahead(event.key);
  }
}

function onOptionClick(index: number): void {
  setActiveOption(index);
  commitOption(index);
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (
    !open.value ||
    !(event.target instanceof Node) ||
    root.value?.contains(event.target) ||
    listbox.value?.contains(event.target)
  )
    return;

  commitOption(activeIndex.value, false);
}

function onFocusOut(event: FocusEvent): void {
  if (
    !open.value ||
    (event.relatedTarget instanceof Node &&
      (root.value?.contains(event.relatedTarget) || listbox.value?.contains(event.relatedTarget)))
  )
    return;

  commitOption(activeIndex.value, false);
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeListbox();
  },
);

onMounted(() => {
  document.addEventListener('pointerdown', onDocumentPointerDown);
  window.addEventListener('resize', scheduleListboxPositionUpdate);
  window.addEventListener('scroll', scheduleListboxPositionUpdate, true);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  window.removeEventListener('resize', scheduleListboxPositionUpdate);
  window.removeEventListener('scroll', scheduleListboxPositionUpdate, true);
  if (positionFrame !== undefined) cancelAnimationFrame(positionFrame);
  resetTypeahead();
});
</script>

<template>
  <div
    ref="root"
    class="relative grid gap-[0.45rem] font-mono text-[0.6rem] text-muted"
    :class="open ? 'z-[60]' : undefined"
    @focusout="onFocusOut"
  >
    <span class="grid gap-[0.2rem]">
      <span class="flex min-w-0 items-baseline gap-2">
        <label
          :id="labelId"
          :for="triggerId"
          class="text-[0.62rem] font-semibold text-foreground"
        >
          {{ label }}
        </label>
        <span
          v-if="meta"
          class="truncate text-[0.54rem] text-muted"
        >
          {{ meta }}
        </span>
      </span>
      <small
        v-if="description"
        :id="descriptionId"
        class="text-[0.56rem] leading-[1.4] text-muted"
      >
        {{ description }}
      </small>
    </span>

    <button
      :id="triggerId"
      ref="trigger"
      class="grid min-h-[2.4rem] w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-line bg-background px-3 py-2 text-left text-[0.65rem] text-foreground transition-colors duration-150 outline-none hover:border-line-strong focus-visible:border-line-strong disabled:cursor-not-allowed disabled:opacity-45"
      type="button"
      role="combobox"
      :disabled="disabled"
      :aria-disabled="disabled || undefined"
      :aria-labelledby="labelId"
      :aria-describedby="description ? descriptionId : undefined"
      aria-autocomplete="none"
      :aria-expanded="open"
      :aria-controls="listboxId"
      :aria-activedescendant="open && activeIndex >= 0 ? getOptionId(activeIndex) : undefined"
      @click="onTriggerClick"
      @keydown="onTriggerKeydown"
    >
      <slot
        name="value"
        :option="selectedOption"
      >
        <span class="truncate">{{ selectedOption?.label }}</span>
      </slot>
      <svg
        class="size-3 shrink-0 stroke-current transition-transform duration-150 motion-reduce:transition-none"
        :class="open ? 'rotate-180' : undefined"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path d="m2.5 4.25 3.5 3.5 3.5-3.5" />
      </svg>
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-100 ease-out motion-reduce:transition-none"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-75 ease-in motion-reduce:transition-none"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <ul
          v-show="open"
          :id="listboxId"
          ref="listbox"
          class="fixed z-[100] grid list-none gap-1 overflow-y-auto overscroll-contain border border-line-strong bg-raised p-1.5 shadow-2xl"
          :style="listboxPosition"
          :data-state="open ? 'open' : 'closed'"
          role="listbox"
          :aria-labelledby="labelId"
          @pointerdown.stop
        >
          <li
            v-for="(option, index) in options"
            :id="getOptionId(index)"
            :key="option.value"
            :ref="(element) => setOptionElement(element, index)"
            class="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border px-2.5 py-2 text-left text-[0.6rem] transition-colors outline-none"
            :class="[
              activeIndex === index
                ? 'border-primary bg-[color-mix(in_srgb,var(--primary)_8%,var(--surface))] text-foreground'
                : 'border-transparent bg-background text-foreground hover:border-line-strong',
              modelValue === option.value
                ? 'outline outline-1 outline-offset-[-2px] outline-primary-bright'
                : undefined,
            ]"
            role="option"
            :aria-selected="activeIndex === index"
            @mousedown.prevent
            @click="onOptionClick(index)"
          >
            <slot
              name="option"
              :option="option"
              :selected="modelValue === option.value"
              :active="activeIndex === index"
            >
              <span class="truncate">{{ option.label }}</span>
            </slot>
            <span
              class="size-1.5 rounded-full"
              :class="activeIndex === index ? 'bg-primary shadow-[0_0_0.4rem_var(--primary)]' : 'bg-line'"
              aria-hidden="true"
            />
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
