<script>
    // internal components
    import Button from '@@Components/Button.svelte';

    export let disabled;
    export let onclick;
    export let label;
</script>

<div class="approve_button">
    <Button label={label} onclick={onclick} disabled={disabled}/>
</div>

<style>
    :global(.approve_button button) {
        background-color: #ebf7eb;
    } 
</style>
