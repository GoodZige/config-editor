<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
const user = useUserStore()
const name = ref(user.savedName)

const router = useRouter()
function go() {
  if (name.value)
    router.push(`/hi/${encodeURIComponent(name.value)}`)
}
const { t } = useI18n()
</script>

<template>
  
</template>

<route lang="yaml">
meta:
  layout: home
</route>
