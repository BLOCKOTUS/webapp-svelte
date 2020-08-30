<script>
    export let value;
    export let type;
    export let loading;
</script>

<div 
    class={type === 'error' ? 'error-area' : 'info-area'} 
    style={value.length === 0 && !loading ? 'display: none;' : ''}
>
	{#if loading}
		<div class="loader"></div>
	{/if}
    {value}
</div>

<style>
	.error-area, .info-area {
		width: 100%;
		margin-bottom: 40px;
		font-size: 30px;
	}

	.error-area {
		background: #f7cfcf;
    }
    
    .info-area {
		background: #ebf7eb;
	}

	.loader,
	.loader:after {
		border-radius: 50%;
		width: 20px;
		height: 20px;
	}

	.loader {
		margin: 5px auto;
		font-size: 10px;
		position: relative;
		text-indent: -9999em;
		border-top: 1.1em solid rgba(255, 62, 0, 0.7);
		border-right: 1.1em solid rgba(255, 62, 0, 0.5);
		border-bottom: 1.1em solid rgba(255, 62, 0, 0.3);
		border-left: 1.1em solid rgba(255, 62, 0, 0.8);
		-webkit-transform: translateZ(0);
		-ms-transform: translateZ(0);
		transform: translateZ(0);
		-webkit-animation: load8 1.1s infinite linear;
		animation: load8 1.1s infinite linear;
	}

	@-webkit-keyframes load8 {
		0% {
				-webkit-transform: rotate(0deg);
				transform: rotate(0deg);
		}
		100% {
				-webkit-transform: rotate(360deg);
				transform: rotate(360deg);
		}
	}
	
	@keyframes load8 {
		0% {
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
</style>