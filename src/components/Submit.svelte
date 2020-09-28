<script lang="typescript">
    import Button from '@@Components/Button.svelte';

    export let disabled: boolean;
    export let onclick: (event: MouseEvent & { target: EventTarget & HTMLButtonElement; }) => any;
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
