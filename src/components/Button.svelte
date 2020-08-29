<script>
	// variables and constants
    export let label;
    export let disabled;
    export let onclick;
</script>

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

<div class="button">
    <button on:click={onclick} disabled={disabled}>{label}</button>
</div>