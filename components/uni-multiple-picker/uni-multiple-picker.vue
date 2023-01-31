<template>
    <view class="multi-picker" :style="[pickerWidth,style]">
        <view class="form">
            <view class="item">
                <!-- 下拉框多选 -->
                <view :class="['select', selectedValues.length > 0 ? 'selected' : '']"
                    @tap.stop="openMultiple(); isShow = true">
                    {{ selectedTexts || '请选择' }}
                </view>
            </view>
        </view>
        <!-- 窄屏选择项 -->
        <view v-if="!isWideScreen" class="cover" v-show="!disabled && isShow">
            <view class="panel">
                <view class="button">
                    <text @tap.stop="cancel">取消</text>
                    <text>{{ title }}</text>
                    <text @tap.stop="confrim" :style="okColor ? 'color:' + okColor : ''">确定</text>
                </view>
                <uni-multiple-picker-option :items="items" :values="values"
                    :checkedAll="checkedAll" :multiple="multiple" :color="color" height="500rpx" @onChange="onChange"/>
            </view>
        </view>

        <!-- 宽屏选择项 -->
        <view v-if="isWideScreen" class="ws-options" v-show="!disabled && isShow">
            <uni-multiple-picker-option :items="items" :values="values"
                    :checkedAll="checkedAll" :multiple="multiple" :color="color" @onChange="onChange"/>
        </view>
    </view>
</template>

<script>
import uniMultiplePickerOption from './uni-multiple-picker-option.vue';

export default {
    components: { uniMultiplePickerOption },
    props: {
        items: {
            type: Array,
            default: () => []
        },
        show: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        values: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        checkedAll: {
            type: Boolean,
            default: true
        },
        multiple: {
            type: Boolean,
            default: true
        },
        okColor: {
            stype: String,
            default: ""
        },
        color: {
            type: String,
            default: ""
        },
        width: {
            type: [Number, String],
            default: "100%"
        },
        wideScreen: {
            type: [Number, String],
            default: -1
        },
        style: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            pickerWidth: "",
            selectedTexts: "",
            selectedValues: [],
            selectedIndex: [],
            list: [],
            isShow: this.show,
            isCheckedAll: false,
            isWideScreen: false // 是否为宽屏
        };
    },
    watch: {
        show: {
            handler(val, old) {
                this.isShow = this.show;
            },
            immediate: true
        },
        wideScreen: {
            handler(newVal, oldVal) {
                const _this = this;
                const width = window.innerWidth;
                if (newVal == -1)
                    return;
                _this.isWideScreen = newVal < width;
            },
            immediate: true
        },
        width: {
            handler(newVal, oldVal) {
                const _this = this;
                _this.pickerWidth = "--width: ";
                if (Object.prototype.toString.call(newVal) === "[object Number]" || /\d$/.test(newVal))
                    _this.pickerWidth += newVal + "rpx";
                else
                    _this.pickerWidth += newVal;
            },
            immediate: true
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
         * 选项变化监听事件
         * @param {Object} args 包含改变项item 和下标i 的对象
         */
        onChange(args) {
            this.$emit("onChange", args);
        },
        /**
         * 取消事件
         * @param {Object} event
         */
        cancel(event) {
            this.isShow = false;
            if (!this.list || this.list.length == 0)
                return;
            this.list.forEach((item, i) => {
                if (this.selectedIndex.indexOf(i) > -1) {
                    this.$set(item, "selected", true);
                }
                else {
                    this.$set(item, "selected", false);
                }
            });
            this.$emit("cancel", event);
        },
        /**
         * 确定事件
         * @param {Object} event
         */
        confrim(event) {
            this.isShow = false;
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
            this.$emit("confrim", event);
        },
    }
}
</script>

<style scoped lang="scss">
.multi-picker {
    position: relative;
    width: var(--width);
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
            position: absolute;
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
        }
    }

    .ws-options {
        width: 100%;
        max-height: 600rpx;
        border-style: solid;
        border-color: #888888;
        border-width: 1px;
        background-color: #ffffff;
        overflow-y: auto;
        overflow-x: auto;
        position: absolute;
        z-index: 1;
        box-sizing: border-box;
    }
}
</style>