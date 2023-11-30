<script setup lang="ts">
  let {count} = defineModels<{count:number}>()
  let a1 = ref<number|null>(null)
  let arr = ref<string[]|null>(null)
  onMounted(()=>{
    count.value = 111
    a1.value = 999
    let page = new PageApi(false)
    page.getPages()
    let page2 = new PageApi(true)
    arr.value = page2.getPages()
    console.log(page2.getPages());
    setTimeout(() => {
      page2.isAuthorized = false
      arr.value = page2.getPages()
    }, 5000);
  })

  const myAuthorize = (target:any,name:any,descriptor:any)=>{
    console.log(target);
    console.log(name);
    
    const originMethod = descriptor.value
    console.log(typeof descriptor);
    
    descriptor.value = function(..._arguments: any){
      if(!this.isAuthorized){
        console.error('not authorized');
        return
      }
      return originMethod.call(this,..._arguments)
    }
  }

  class PageApi{
    isAuthorized:boolean
    constructor(isAuthorized:boolean){
      this.isAuthorized = isAuthorized
    }
    @myAuthorize
    getPages(){
      return ['p1','p2','p3'] 
    }
  }
</script>

<template>
  <div wfull hfull id="decorator">
    {{ `count:${count},a1:${a1},arr:${arr}` }}
  </div>
</template>
<route lang="yaml">
  meta:
    layout: home
</route>