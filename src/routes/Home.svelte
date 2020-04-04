<script>
	// external components
	import { link } from 'svelte-spa-router'
	
	// internal components
	import appConfig from '../config/app';
	import Button from '../components/Button.svelte';
</script>

<div>
    <h1>{appConfig.title}</h1>
    <a href="/getverified" use:link><Button label="Get verified" /></a>
    <a href="/verify" use:link><Button label="Verify" /></a>
</div>
    
<style>

</style>