<script>
    // internal components
    import Button from './Button.svelte';

    export let disabled;
    export let onclick;
    export let label;
</script>

<style>
    :global(.approve_button button) {
        background-color: #ebf7eb;
    } 
</style>

<div class="approve_button">
    <Button label={label} onclick={onclick} disabled={disabled}/>
</div>