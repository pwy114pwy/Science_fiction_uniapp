<template>
  <view class="container">
    <view class="header">
      <text class="title">科幻小说图鉴</text>
      <text class="subtitle">您的专属科幻空间</text>
    </view>
    <view class="search-bar">
      <input type="text" placeholder="搜索图鉴" v-model="TuText" class="search-input" />
      <button @click="searchTu" class="search-btn">
        <uni-icons type="search" size="20" color="#ffffff"></uni-icons>
      </button>
    </view>
    <scroll-view class="scroll-view" scroll-y>
      <transition-group name="fade" tag="div">
        <view v-for="(item, index) in displayedItems" :key="index" class="item">
          <image :src="item.Illustrated_Img" mode="aspectFill" class="item-image"></image>
          <view class="content">
            <text class="name">{{ item.Book_Name }}</text>
            <button @click="showDetails(item)" class="details-btn">查看详情</button>
          </view>
        </view>
      </transition-group>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {Get_AllIllustrated} from '@/api'
let TuText = ref('');
let Illustrated_List = ref([]);
let Search_List = ref([]);
let issearch = ref(false);

// 搜索图鉴
function searchTu() {
  if (TuText.value.trim()) {
    issearch.value = true;
    Search_List.value = Illustrated_List.value.filter(item =>
      item.Book_Name.toLowerCase().includes(TuText.value.toLowerCase())
    );
  } else {
    issearch.value = false;
  }
}

// 获取全部图鉴
async function getAll_Illustrated() {
  try {
    const response = await uni.request({
      url: Get_AllIllustrated,
      method: 'GET'
    });
    Illustrated_List.value = response.data;
    Search_List.value = [...response.data];
  } catch (e) {
    console.error(e);
  }
}

// 显示详情
function showDetails(item) {
  uni.setStorageSync('NowIllustrated', item);
  uni.navigateTo({
    url: `/pages/Illustrated_detail/Illustrated_detail?id=${item.Book_ID}`
  });
  console.log(item);
}

const displayedItems = computed(() => issearch.value ? Search_List.value : Illustrated_List.value);

onMounted(() => {
  getAll_Illustrated();
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%);
}

/* 头部 */
.header {
  padding: 32upx 24upx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4upx 20upx rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200upx;
  height: 200upx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.title {
  font-size: 40upx;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2upx 4upx rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 24upx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 8upx;
  position: relative;
  z-index: 1;
}

/* 搜索框 */
.search-bar {
  display: flex;
  align-items: center;
  padding: 20upx;
  background-color: transparent;
}

.search-input {
  flex-grow: 1;
  height: 70upx;
  padding: 0 30upx;
  border: none;
  background-color: #ffffff;
  border-radius: 35upx;
  font-size: 28upx;
  color: #333;
  margin-right: 16upx;
  box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.08);
}

.search-btn {
  width: 70upx;
  height: 70upx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  padding: 0;
  box-shadow: 0 4upx 12upx rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.search-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2upx 8upx rgba(102, 126, 234, 0.4);
}

/* 滚动视图 */
.scroll-view {
  flex: 1;
  overflow-y: auto;
  padding: 0 20upx 20upx;
}

/* 图鉴卡片 */
.item {
  margin-bottom: 24upx;
  background: #ffffff;
  border-radius: 20upx;
  overflow: hidden;
  box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.item:active {
  transform: translateY(-4upx);
  box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.12);
}

.item-image {
  width: 100%;
  height: 360upx;
  object-fit: cover;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
}

.content {
  padding: 24upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name {
  flex: 1;
  font-size: 32upx;
  font-weight: 700;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 16upx;
}

.details-btn {
  padding: 16upx 32upx;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 30upx;
  font-size: 26upx;
  font-weight: 600;
  box-shadow: 0 4upx 12upx rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.details-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2upx 8upx rgba(102, 126, 234, 0.3);
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20upx);
}
</style>