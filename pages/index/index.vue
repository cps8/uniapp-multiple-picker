<template>
	<text>多项选择器：</text>
	<multiple-picker :title="title" :items="items" :disabled="disabled" :show="show" :values="value" @confrim="onConfrim"/>
</template>

<script>
	export default {
		data() {
			return {
				title: "请选择",
				items: [],
				disabled: false,
				show: false,
				value: []
			}
		},
		onLoad() {

		},
		methods: {
			onConfrim(event){
				console.log(event);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import url("./index.scss");
</style>
