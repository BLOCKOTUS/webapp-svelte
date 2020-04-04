<script>
	// external components
	import { link } from 'svelte-spa-router'

	// internal components
	import Button from '../components/Button.svelte';
</script>

<div>
    Success. You can look at the encrypted data in your console.
    
	<p><a href="/" use:link><Button label="Home" /></a></p>

</div>
    
<style>

</style>