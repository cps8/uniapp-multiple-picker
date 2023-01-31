<template>
    <view class="option" :style="optionHeight">
        <view class="checked-all item" v-show="multiple && checkedAll" @tap.stop="onCheckedAll"
            :class="[isCheckedAll ? 'checked' : '']">
            <icon v-show="isCheckedAll" type="success_no_circle" class="icon" size="16" :color="color ? color : ''" />
            <text :style="[(color && isCheckedAll) ? 'color:' + color : '']">全选</text>
        </view>
        <checkbox-group>
            <view class="item" v-for="(item, index) in list" :class="[item.selected ? 'checked' : '']"
                @tap.stop="onChange(item, index)" :disabled="item.disabled">
                <icon v-show="item.selected" class="icon" type="success_no_circle" size="16"
                    :color="item.disabled ? 'grey' : color ? color : ''" />
                <text :style="[(color && item.selected) ? 'color:' + color : '']">{{ item.text }}</text>
            </view>
        </checkbox-group>
    </view>
</template>

<script>
export default {
    props: {
        items: {    // 多选列表初始值
            type: Array,
            default: () => []
        },
        values: {
            type: String,
            default: ""
        },
        multiple: { // 是否启用多选模式
            type: Boolean,
            default: true
        },
        checkedAll: {// 是否启用全选功能
            type: Boolean,
            default: true
        },
        color: {    // 选中项颜色
            type: String,
            default: ""
        },
        height: {// 组件高度
            type: [Number, String],
            default: "100%"
        }
    },
    data() {
        return {
            list: this.items,       // 全量选项集合
            isCheckedAll: false,    // 是否已全选
            selectedTexts: "",      // 已选集合文本
            selectedValues: [],     // 已选集合code
            selectedIndex: [],      // 已选集合下标
            optionHeight: ""        // 组件高度
        }
    },
    watch: {
        height: {
            handler(newVal, oldVal) {
                const _this = this;
                _this.optionHeight = "--option-height: ";
                if (Object.prototype.toString.call(newVal) === "[object Number]" || /\d$/.test(newVal))
                    _this.optionHeight += newVal + "rpx";
                else
                    _this.optionHeight += newVal;
            },
            immediate: true
        }
    },
    methods: {
        /**
         * 改变选项选中状态事件
         * @param {Object} item
         * @param {Number} i
         */
        onChange(item, i) {
            if (item.disabled)
                return;
            this.list[i].selected = !this.list[i].selected;
            if (this.multiple) {
                if (this.selectedIndex.indexOf(i) === -1)
                    this.selectedIndex.push(i);
            }
            else {
                if (this.selectedIndex.length > 0 && this.selectedIndex[0] != i)
                    this.list[this.selectedIndex[0]].selected = false;
                this.selectedIndex = [i];
            }
            if (this.isCheckedAll && !this.list[i].selected) {
                this.isCheckedAll = false;
            }
            else {
                let isCheckedAll = this.isCheckedAll;
                try {
                    this.isCheckedAll = true;
                    for (let j = 0; j < this.list.length; j++) {
                        if (!this.list[j].selected) {
                            this.isCheckedAll = false;
                            break;
                        }
                    }
                }
                catch (e) {
                    this.isCheckedAll = isCheckedAll;
                    console.error(e);
                }
            }
            // console.log({ item: this.list[i], i: i });
            this.$emit("onChange", { item: item, i: i });
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

<style lang="scss" scoped>
.option {
    width: 100%;
    height: var(--option-height);
    // overflow-y: auto;
    padding-left: 20rpx;
    padding-right: 20rpx;
    margin-bottom: auto;
    margin-top: auto;
    box-sizing: border-box;

    .checked-all {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .item {
        position: relative;
        border-bottom: 1rpx solid #CCCCCC;
        width: 100%;
        height: 60rpx;
        line-height: 60rpx;
        // text-align: center;

        .icon {
            position: absolute;
            top: 0;
            bottom: 0;
            margin-top: auto;
            margin-bottom: auto;
            height: 32rpx;
            left: 10rpx;
            display: flex;
        }

        text{
            display: block;
            text-align: center;
            margin-left:45rpx;
            overflow: hidden;
            word-break: keep-all;
        }

        &.checked {
            color: #2D8DFF;
        }

    }
}
</style>