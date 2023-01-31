<template>
	<view style="position: relative;">
		<uni-multiple-picker :title="title" :items="items" :disabled="disabled" :show="show" :values="value" color="#ff0000" okColor="#ff3333"
			:multiple="false" @confrim="onConfrim" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: "请选择",
			items: [{ code: "001", text: "选项1" }, { code: "002", text: "选项2" }, { code: "003", text: "选项3" }],
			disabled: false,
			show: false,
			value: ""
		}
	},
	onLoad() {

	},
	methods: {
		onConfrim(event) {
			// console.log(event);
		}
	}
}
</script>

<style lang="scss" scoped>
@import url("./index.scss");
</style>
