<script>
    // internal components
    import Button from '@@Components/Button.svelte';

    export let disabled;
    export let onclick;
</script>

<div class="submit">
    <Button label="Submit" onclick={onclick} disabled={disabled}/>
</div>

<style>
    :global(.submit button) {
        background-color: #ebf7eb;
        margin-top: 2vw;
    } 
</style>
