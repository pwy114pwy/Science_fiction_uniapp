<template>
  <view class="container">
    <view class="header">
      <text class="title">科幻小说图鉴</text>
      <text class="subtitle">您的专属科幻空间</text>
    </view>
    <view class="search-bar">
      <input type="text" placeholder="搜索图鉴" v-model="TuText" class="search-input" />
      <button @click="searchTu" class="search-btn">
        <uni-icons type="search" size="20" style="color: aliceblue;"></uni-icons>
      </button>
    </view>
    <scroll-view class="scroll-view" scroll-y>
      <transition-group name="fade" tag="div">
        <view v-for="(item, index) in displayedItems" :key="index" class="item">
          <image :src="item.Illustrated_Img" mode="aspectFill" class="item-image"></image>
          <view class="content">
            <text class="name">{{ item.Book_Name }}</text>
            <button @click="showDetails(item)" class="details-btn">详情</button>
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
/* @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap'); */

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
  font-family: 'Roboto', sans-serif;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
}

.search-input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  margin-right: 10px;
}

.search-btn {
  padding: 10px 20px;
  border: none;
  background-color: #1e90ff;
  color: white;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #1c86ee;
}

.header {
  padding: 20px;
  background-color: #fff;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 18px;
  color: #666;
  margin-top: 5px;
}

.scroll-view {
  flex: 1;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.item {
  margin: 20px;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.item:hover {
  transform: translateY(-5px);
}

.item-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.content {
  padding: 15px;
}

.name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.details-btn {
  padding: 10px 20px;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.details-btn:hover {
  background-color: #45a049;
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>