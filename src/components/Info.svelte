<script>
    export let value;
    export let type;
</script>

<div 
    class={type === 'error' ? 'error-area' : 'info-area'} 
    style={value.length === 0 ? 'display: none;' : ''}
>
    {value}
</div>

<style>
	.error-area {
		background: #f7cfcf;
		width: 100%;
		margin-bottom: 40px;
    }
    
    .info-area {
		background: #ebf7eb;
		width: 100%;
		margin-bottom: 40px;
	}
</style>