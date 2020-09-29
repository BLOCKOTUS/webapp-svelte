<script lang="typescript">
    export let label: string;
    export let disabled: boolean;
    export let onclick: (event: MouseEvent & { target: EventTarget & HTMLButtonElement; }) => any;
</script>

<div class="button">
    <button on:click={onclick} disabled={disabled}>{label}</button>
</div>

<style>
    :global(.button button) {
        width: 42vw !important;
		font-size: 30px;
		border-radius: 4.2%;
        margin: 5px;
	}

    :global(.button button:hover) {
        background-color: #fafafa;
    } 

    :global(.button button:active) {
        transform: translateY(4px);
    }
</style>
