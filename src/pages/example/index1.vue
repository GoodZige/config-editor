<script setup lang="ts">
  let {count} = defineModels<{count:number}>()
  let a1 = ref<number|null>(null)
  onMounted(()=>{
    count.value = 111
    a1.value = 999
    
  })

</script>

<template>
  <div wfull hfull fm-ps2 id="decorator">
    {{ `count:${count},a1:${a1}` }}
    <p fm-fc>Fira code</p>
    <p fm-rw>WWWwww哈哈</p>
  </div>
</template>
<route lang="yaml">
  meta:
    layout: home
</route>