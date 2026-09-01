<script setup lang="ts">
import type { DeveloperProfile } from '@/types/content';

defineProps<{
  profile: DeveloperProfile;
}>();

const lineNumber = (line: number) => String(line).padStart(2, '0');
</script>

<template>
  <aside
    class="relative w-full border border-line-strong bg-raised/85 shadow-[1.5rem_1.5rem_0_color-mix(in_srgb,var(--primary)_2.5%,transparent),0_2rem_6rem_rgb(0_0_0/20%)] backdrop-blur-[18px] before:pointer-events-none before:absolute before:-top-px before:-left-px before:size-[0.65rem] before:border-t-2 before:border-l-2 before:border-primary-bright before:content-[''] after:pointer-events-none after:absolute after:-right-px after:-bottom-px after:size-[0.65rem] after:border-r-2 after:border-b-2 after:border-primary-bright after:content-[''] md:max-w-md"
    :aria-label="$t('accessibility.developerProfile')"
  >
    <div
      class="flex items-center justify-between border-b border-line px-[0.9rem] py-3 font-mono text-[0.62rem] text-muted"
    >
      <span>{{ profile.filename }}</span>

      <span
        class="flex gap-1.5 [&>i]:block [&>i]:size-[0.35rem] [&>i]:rounded-full [&>i]:bg-quiet [&>i:last-child]:bg-primary [&>i:last-child]:shadow-[0_0_0.5rem_color-mix(in_srgb,var(--primary)_80%,transparent)]"
        aria-hidden="true"
      >
        <i /><i /><i />
      </span>
    </div>

    <div
      class="overflow-hidden px-[0.9rem] pt-[1.35rem] pb-6 font-mono text-[0.64rem] leading-[1.9] whitespace-nowrap text-foreground sm:text-[0.7rem] lg:text-[0.75rem]"
      aria-hidden="true"
    >
      <p>
        <span class="inline-block w-8 text-quiet select-none">01</span
        ><span class="text-[#b48cff]">const</span> developer = {
      </p>
      <p>
        <span class="inline-block w-8 text-quiet select-none">02</span>&nbsp;&nbsp;name:
        <span class="text-primary-bright">'{{ profile.name }}'</span>,
      </p>
      <p>
        <span class="inline-block w-8 text-quiet select-none">03</span>&nbsp;&nbsp;role:
        <span class="text-primary-bright">'{{ profile.role }}'</span>,
      </p>
      <p><span class="inline-block w-8 text-quiet select-none">04</span>&nbsp;&nbsp;focus: [</p>
      <p
        v-for="(focus, index) in profile.focus"
        :key="focus"
      >
        <span class="inline-block w-8 text-quiet select-none">{{ lineNumber(index + 5) }}</span
        >&nbsp;&nbsp;&nbsp;&nbsp;<span class="text-primary-bright">'{{ focus }}'</span
        >{{ index < profile.focus.length - 1 ? ',' : '' }}
      </p>
      <p>
        <span class="inline-block w-8 text-quiet select-none">{{ lineNumber(profile.focus.length + 5) }}</span
        >&nbsp;&nbsp;]
      </p>
      <p>
        <span class="inline-block w-8 text-quiet select-none">{{ lineNumber(profile.focus.length + 6) }}</span
        >};<span class="profile-cursor ml-1 inline-block h-[1em] w-[0.45rem] bg-primary align-[-0.15em]" />
      </p>
    </div>
    <div
      class="flex items-center justify-between border-t border-line px-[0.9rem] py-[0.7rem] font-mono text-[0.62rem] text-muted"
    >
      <SharedStatusIndicator
        :label="profile.status"
        size="compact"
      />
      <span class="hidden xs:inline">{{ profile.location }}</span>
    </div>
  </aside>
</template>

<style scoped>
.profile-cursor {
  animation: cursor-blink 1.05s steps(2, jump-none) infinite;
}

@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}
</style>
