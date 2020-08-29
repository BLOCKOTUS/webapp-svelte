<script>
    // internal components
    import Button from '@@Components/Button.svelte';

    export let disabled;
    export let onclick;
    export let label;
</script>

<style>
    :global(.refuse_button button) {
        background-color: #f8c3c3;
    } 
</style>

<div class="refuse_button">
    <Button label={label} onclick={onclick} disabled={disabled}/>
</div>