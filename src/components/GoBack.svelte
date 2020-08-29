<script>
	// external components
    import { pop } from 'svelte-spa-router'

    // internal components
    import Button from '@@Components/Button.svelte';
</script>

<style>
    :global(.go_back_button button) {
		margin-top: 20px;
	}
</style>

<div class="go_back_button">
    <Button label="Go back" onclick={() => pop()} />
</div>
