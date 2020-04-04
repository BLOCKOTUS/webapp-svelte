<script>
    // internal components
    import Button from './Button.svelte';

    export let disabled;
    export let onclick;
</script>

<style>
    :global(.submit button) {
        background-color: #ebf7eb;
    } 
</style>

<div class="submit">
    <Button label="Submit" onclick={onclick} disabled={disabled}/>
</div>