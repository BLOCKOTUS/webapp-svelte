<script lang="typescript">
    import Button from '@@Components/Button.svelte';

    export let disabled;
    export let onclick: () => Promise<void>;
    export let label;
</script>

<div class="refuse_button">
    <Button label={label} onclick={onclick} disabled={disabled}/>
</div>

<style>
    :global(.refuse_button button) {
        background-color: #f8c3c3;
    } 
</style>
