<template>
    <view class="multi-picker">
        <view class="form">
            <view class="item">
                <!-- 下拉框多选 -->
                <view :class="['select', selectedValues.length > 0 ? 'selected' : '']"
                    @tap.stop="openMultiple(); isShow = true">
                    {{ selectedTexts || '请选择' }}
                </view>
            </view>
        </view>

        <view class="cover" v-show="!disabled && isShow">
            <view class="panel">
                <view class="button">
                    <text @tap.stop="cancel">取消</text>
                    <text>{{ title }}</text>
                    <text @tap.stop="confrim">确定</text>
                </view>
                <div class="option">
                    <view class="checked-all item" v-show="checkedAll" @tap.stop="onCheckedAll"
                        :class="[isCheckedAll ? 'checked' : '']">
                        全选
                        <icon v-show="isCheckedAll" type="success_no_circle" class="icon" size="16" />
                    </view>
                    <checkbox-group>
                        <view class="item" v-for="(item, index) in list" :class="[item.selected ? 'checked' : '']"
                            @tap.stop="onChange(item, index)" :disabled="item.disabled">
                            {{ item.text }}
                            <icon v-show="item.selected" class="icon" type="success_no_circle" size="16"
                                :color="item.disabled ? 'grey' : '#2D8DFF'" />
                        </view>
                    </checkbox-group>
                </div>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        items: {    // 多选列表初始值
            type: Array,
            default: () => []
        },
        show: {     // 多选列表是否显示
            type: Boolean,
            default: false
        },
        disabled: { // 组件是否可用
            type: Boolean,
            default: false
        },
        values: {   // 组件默认选中code集合
            type: String,
            default: ""
        },
        text: {     // 组件默认选中显示文本
            type: String,
            default: ""
        },
        title: {    // 组件选择器标题
            type: String,
            default: ""
        },
        checkedAll: {// 是否启用全选功能
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            selectedTexts: "",      // 已选集合文本
            selectedValues: [],     // 已选集合code
            selectedIndex: [],      // 已选集合下标
            list: [],               // 全量选项集合
            isShow: this.show,      // 组件是否显示
            isCheckedAll: false     // 是否已全选
        }
    },
    watch: {
        show: {
            handler(val, old) {
                this.isShow = this.show;
            },
            immediate: true
        },
        checkedAll(val) {
            if (!val)
                val = false;
            this.onCheckedAll();
        },
        values(val) {
            if (!val)
                return;
            let codes = val.split(",");
            this.selectedValues = Object.assign([], codes);
            this.openMultiple();
        }
    },
    methods: {
        /**
         * 初始化弹出框数据列表显示
         */
        openMultiple() {
            this.selectedTexts = "";
            this.selectedIndex = [];
            this.isCheckedAll = true;
            this.items.forEach((item, i) => {
                if (this.selectedValues && this.selectedValues.indexOf(item.code) > -1) {
                    this.$set(item, "selected", true);
                    this.selectedTexts += (this.selectedTexts ? "、" : "") + item.text;
                    this.selectedIndex.push(i);
                } else {
                    this.$set(item, "selected", false);
                    this.isCheckedAll = false;
                }
            });
            this.list = Object.assign([], this.items);
        },
        /**
         * 改变选项选中状态事件
         * @param {Object} item 
         * @param {Number} i 
         */
        onChange(item, i) {
            if (item.disabled)
                return;
            this.list[i].selected = !this.list[i].selected;
            if (this.isCheckedAll && !this.list[i].selected) {
                this.isCheckedAll = false;
            } else {
                let isCheckedAll = this.isCheckedAll;
                try {
                    this.isCheckedAll = true;
                    for (let j = 0; j < this.list.length; j++) {
                        if (!this.list[j].selected) {
                            this.isCheckedAll = false;
                            break;
                        }
                    }
                } catch (e) {
                    this.isCheckedAll = isCheckedAll;
                    console.error(e);
                }

            }
            this.$emit("onChange", { item: item, i: i });
        },
        /**
         * 取消事件
         * @param {Object} event 
         */
        cancel(event) {
            if (!this.list || this.list.length == 0)
                return;
            this.list.forEach((item, i) => {
                if (this.selectedIndex.indexOf(i) > -1) {
                    this.$set(item, "selected", true);
                } else {
                    this.$set(item, "selected", false);
                }
            })
            this.isShow = false;
            this.$emit("cancel", event);
        },
        /**
         * 确定事件
         * @param {Object} event 
         */
        confrim(event) {
            if (!this.list && this.list.length > 0)
                return;
            this.selectedValues = [];
            this.selectedTexts = "";
            this.selectedIndex = [];
            let selected = [];
            for (let i = 0; i < this.list.length; i++) {
                let item = this.list[i];
                if (item.selected) {
                    selected.push(item);
                    if (this.selectedValues.indexOf(item.code) == -1)
                        this.selectedValues.push(item.code);
                    if (this.selectedTexts.indexOf(item.text) == -1) {
                        if (!this.selectedTexts)
                            this.selectedTexts += item.text;
                        else
                            this.selectedTexts += "、" + item.text;
                    }
                    if (this.selectedIndex.indexOf(i) == -1)
                        this.selectedIndex.push(i);
                }
            }
            event.currentTarget.dataset.multiPicker = {
                values: this.selectedValues,
                texts: this.selectedTexts,
                indnexs: this.selectedIndex,
                selected: selected
            };
            this.isShow = false;
            this.$emit("confrim", event);
        },
        /**
         * 全选事件
         */
        onCheckedAll() {
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].disabled)
                    continue;
                this.list[i].selected = !this.isCheckedAll;
            }
            this.isCheckedAll = !this.isCheckedAll;
        }
    }
}
</script>

<style scoped lang="scss">
.multi-picker {
    position: relative;

    .form {
        width: 100%;
        box-sizing: border-box;

        .item {
            width: 100%;

            .select {
                width: 100%;
                padding-left: 9px;
                padding-right: 9px;
                box-sizing: border-box;
                color: #CCCCCC;

                &.selected {
                    color: black;
                }
            }
        }
    }

    .cover {
        z-index: 2;
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(10, 10, 10, 0.4);

        .panel {
            width: 100%;
            height: 600rpx;
            position: fixed;
            background-color: rgba(255, 255, 255, 1);
            bottom: 0;
            left: 0;
            right: 0;

            .button {
                width: 100%;
                height: 80rpx;
                border-bottom: #aaaaaa solid 1rpx;
                padding-left: 20rpx;
                padding-right: 20rpx;
                box-sizing: border-box;
                line-height: 80rpx;
                text-align: center;
                color: #888888;

                text:first-child {
                    color: #888888;
                    float: left;
                }

                text:last-child {
                    color: rgb(77, 157, 254);
                    float: right;
                }
            }

            .option {
                width: 100%;
                height: 500rpx;
                overflow-y: scroll;
                padding-left: 20rpx;
                padding-right: 20rpx;
                margin-bottom: auto;
                margin-top: auto;
                box-sizing: border-box;

                .item {
                    position: relative;
                    border-bottom: 1rpx solid #CCCCCC;
                    width: 100%;
                    height: 60rpx;
                    line-height: 60rpx;
                    text-align: center;

                    .icon {
                        position: absolute;
                        top: 50%;
                        right: 10rpx;
                        transform: translateY(-50%);
                    }

                    &.checked {
                        color: #2D8DFF;
                    }

                }
            }
        }
    }
}
</style>