<template>
  <view class="container">
    <!-- 返回按钮 -->
    <view class="back-button">
      <button @click="goBack" class="back-btn">返回</button>
    </view>

    <!-- 搜索结果标题 -->
    <view class="result-title">
      <text class="title-text">搜索结果：</text>
      <text class="keyword-text">{{ keyword || tag }}</text>
    </view>

    <!-- 搜索结果列表 -->
    <view class="book-list">
      <view class="book-item" v-for="(item, index) in searchResults" :key="index" @click="goToDetail(item.Book_ID)">
        <image :src="item.Img_Url" mode="aspectFill" class="book-image"></image>
        <view class="book-info">
          <p class="book-name">{{ item.Book_Name }}</p>
          <p class="book-author">{{ item.Author }}</p>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import {Search_Book} from "@/api"
let keyword = ref('');
let tag = ref('');
let searchResults = ref([]);

// 获取搜索结果
async function fetchSearchResults() {
  try {
    const response = await uni.request({
      url: Search_Book,
      method: 'POST',
      data: {
        keyword: keyword.value,
        tag: tag.value
      }
    });
    searchResults.value = response.data;
  } catch (error) {
    console.error('Error fetching search results:', error);
  }
}

// 返回上一页
let goBack = () => {
  uni.navigateBack();
};

// 跳转到详情页
let goToDetail = (id) => {
  uni.setStorageSync('currentItemId', id);
  uni.navigateTo({
    url: `/pages/detail/detail?id=${JSON.stringify(id)}`
  });
};

// 页面加载时获取参数并调用搜索函数
onLoad((options) => {
  if (options.keyword) {
    keyword.value = decodeURIComponent(options.keyword);
  }
  if (options.tag) {
    tag.value = options.tag;
  }
  fetchSearchResults();
});
</script>

<style scoped>
/* 添加一些样式 */
.container {
  background-color: #f5f5f5;
  padding: 20px;
}

.back-button {
  margin-bottom: 10px;
}

.back-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
}

.result-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.title-text {
  color: #333;
}

.keyword-text {
  color: #007bff;
}

.book-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.book-item {
  width: 30%;
  margin: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s;
}

.book-item:hover {
  transform: scale(1.05);
}

.book-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.book-info {
  padding: 10px;
}

.book-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.book-author {
  font-size: 14px;
  color: #666;
  margin: 5px 0 0;
}
</style>