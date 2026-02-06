<template>
  <!-- <button @click="get_ai_recommendations" class="ai-gen-btn">AI生成小说简介</button> -->
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-bar">
      <input type="text" placeholder="搜索小说" v-model="searchText" class="search-input" />
      <button @click="searchNovel" class="search-btn">
        <uni-icons type="search" size="20" color="#ffffff"></uni-icons>
      </button>
    </view>

    <!-- 轮播图 -->
    <swiper class="swiper-box" :indicator-dots="true" :autoplay="true" interval="3000" duration="1000" circular="true">
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <image :src="item.Img_Url" class="swiper-img" @click="goToDetail(item)" />
      </swiper-item>
    </swiper>

    <!-- 小说主题分类 -->
    <view class="genre-list">
      <view class="section-title">
        <text>📚 小说主题分类</text>
      </view>
      <view class="tag-list">
        <view class="tag-item" v-for="(item, index) in Booktopic.slice(0, 4)" :key="index" @click="filterByTag(item)">
          <text>{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 经典作品推荐 -->
    <view class="recommend-section">
      <view class="section-title">
        <text>🏆 经典作品推荐</text>
      </view>
      <scroll-view scroll-x class="book-list">
        <view class="book-item" v-for="(item, index) in classicBooks" :key="index" @click="goToDetail(item)">
          <image :src="item.Img_Url" mode="aspectFill" class="book-image" />
          <p class="book-name">{{ item.Book_Name }}</p>
        </view>
      </scroll-view>
    </view>

    <!-- 热门作品推荐 -->
    <view class="recommend-section">
      <view class="section-title">
        <text>🔥 热门作品推荐</text>
      </view>
      <scroll-view scroll-x class="book-list">
        <view class="book-item" v-for="(item, index) in hotBooks" :key="index" @click="goToDetail(item)">
          <image :src="item.Img_Url" mode="aspectFill" class="book-image" />
          <p class="book-name">{{ item.Book_Name }}</p>
        </view>
      </scroll-view>
    </view>

    <!-- AI智能推荐 -->
    <view class="recommend-section ai-recommend">
      <view class="section-title">
        <text>✨ AI智能推荐</text>
      </view>
      <view v-if="isLoggedIn && aiRecommendations.length > 0">
        <scroll-view scroll-x class="book-list">
          <view class="book-item" v-for="(item, index) in aiRecommendations" :key="index" @click="goToDetail(item)">
            <image :src="item.Img_Url" mode="aspectFill" class="book-image" />
            <p class="book-name">{{ item.Book_Name }}</p>
          </view>
        </scroll-view>
      </view>
      <view v-else-if="isLoggedIn" class="no-recommendations">
        <text>暂无推荐内容</text>
      </view>
      <view v-else class="no-recommendations">
        <text>登录后可查看个性化推荐</text>
        <button @click="handleLogin" class="login-btn">立即登录</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Get_Swiper, Get_All_Books, Get_AI_Recommendations } from '@/api';

let searchText = ref('');

// 假设这是从服务器获取的数据
let swiperList = ref([]);
let AllBooks = ref([]);
let classicBooks = ref([]);
let hotBooks = ref([]);
let Booktopic = ref([]);
let aiRecommendations = ref([]);
let isLoggedIn = ref(false);
let user = ref({});

let tags = ref([
  { name: '太空探险' },
  { name: '人工智能' },
  { name: '异世界' },
  // 更多标签...
]);

function switchTab(url) {
  uni.switchTab({
    url: url
  });
}

let goToDetail = (item) => {
  uni.setStorageSync('NowBook', item);
  uni.navigateTo({
    url: `/pages/detail/detail?id=${JSON.stringify(item.Book_ID)}`
  });
};

async function get_swpier_img() {
  try {
    const response = await uni.request({
      url: Get_Swiper,
      method: 'GET'
    });
    swiperList.value = response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
  }
}

async function get_books_img() {
  try {
    const response = await uni.request({
      url: Get_All_Books,
      method: 'GET'
    });
    AllBooks.value = response.data;
    classicBooks.value = AllBooks.value.filter(item => item.Tag.includes("classic"));
    hotBooks.value = AllBooks.value.filter(item => item.Tag.includes("hot"));
    Booktopic.value = [...new Set(AllBooks.value.map(item => item.Topic).join(' ').split(' '))];
  } catch (error) {
    console.error('Error fetching books:', error);
  }
}

// 获取AI推荐的书籍
async function get_ai_recommendations() {
  try {
    // 检查用户是否已登录
    if (uni.getStorageSync('token')) {
      isLoggedIn.value = true;
      user.value = JSON.parse(uni.getStorageSync('userInfo'));

      const response = await uni.request({
        url: Get_AI_Recommendations,
        method: 'POST',
        header: {
          Authorization: `Bearer ${uni.getStorageSync('token')}`
        },
        data: {
          user_name: user.value.username
        },
        timeout: 20000 // 设置20秒超时时间
      });

      if (response.statusCode === 200) {
        aiRecommendations.value = response.data.recommendations;
      } else {
        console.error('Failed to get AI recommendations:', response.data);
      }
    }
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    // 如果是超时错误,不显示错误提示,只在控制台记录
    if (error.errMsg && !error.errMsg.includes('timeout')) {
      uni.showToast({
        title: '获取AI推荐失败',
        icon: 'none'
      });
    }
  }
}

let searchNovel = () => {
  if (searchText.value) {
    uni.navigateTo({
      url: '/pages/search/search?keyword=' + encodeURIComponent(searchText.value)
    });
  }
};

let filterByTag = (tagName) => {
  uni.navigateTo({
    url: '/pages/search/search?tag=' + tagName
  });
};

// 跳转到登录页面
let handleLogin = () => {
  uni.navigateTo({
    url: '/pages/login/login'
  });
};

onMounted(() => {
  get_swpier_img();
  get_books_img();
  get_ai_recommendations();
});
</script>

<style scoped>
/* AI生成按钮 */
.ai-gen-btn {
  position: fixed;
  top: 20upx;
  right: 20upx;
  z-index: 999;
  padding: 12upx 24upx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 30upx;
  font-size: 24upx;
  font-weight: 600;
  box-shadow: 0 4upx 12upx rgba(102, 126, 234, 0.4);
}

.container {
  padding-top: 20upx;
  background: linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%);
  min-height: 100vh;
}

/* 搜索框 */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20upx;
  padding: 8upx;
  background: #ffffff;
  border-radius: 30upx;
  box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.08);
}

.search-input {
  flex: 1;
  height: 60upx;
  padding-left: 30upx;
  font-size: 28upx;
  color: #333;
  background-color: transparent;
  border: none;
}

.search-btn {
  width: 60upx;
  height: 60upx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  border: none;
  padding: 0;
  box-shadow: 0 4upx 8upx rgba(102, 126, 234, 0.3);
}

/* 轮播图 */
.swiper-box {
  height: 320upx;
  margin: 20upx;
  border-radius: 20upx;
  overflow: hidden;
  box-shadow: 0 8upx 24upx rgba(0, 0, 0, 0.12);
}

.swiper-img {
  width: 100%;
  height: 100%;
  border-radius: 20upx;
}

/* 分类和推荐区域 */
.genre-list,
.recommend-section {
  margin: 20upx;
  padding: 24upx;
  background: #ffffff;
  border-radius: 20upx;
  box-shadow: 0 4upx 16upx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 32upx;
  font-weight: 700;
  color: #333;
  margin-bottom: 20upx;
  display: flex;
  align-items: center;
}

.section-title text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* AI推荐特殊样式 */
.ai-recommend {
  background: linear-gradient(135deg, #fff9f0 0%, #ffffff 100%);
  border: 2upx solid rgba(102, 126, 234, 0.2);
}

.ai-recommend .section-title text {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.no-recommendations {
  padding: 60upx 40upx;
  text-align: center;
  color: #999;
  font-size: 28upx;
}

.login-btn {
  margin-top: 24upx;
  padding: 16upx 48upx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  border: none;
  border-radius: 30upx;
  font-size: 28upx;
  font-weight: 600;
  box-shadow: 0 4upx 12upx rgba(245, 87, 108, 0.3);
}

/* 标签列表 */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16upx;
  margin-top: 20upx;
}

.tag-item {
  flex: 1;
  min-width: 140upx;
  height: 80upx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  border-radius: 16upx;
  border: 2upx solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.tag-item:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.tag-item:active text {
  color: #ffffff;
}

.tag-item text {
  font-size: 26upx;
  font-weight: 600;
  color: #667eea;
}

/* 书籍列表 */
.book-list {
  white-space: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.book-list::-webkit-scrollbar {
  display: none;
}

.book-item {
  display: inline-block;
  width: 200upx;
  margin-right: 20upx;
  text-align: center;
  transition: transform 0.3s ease;
}

.book-item:active {
  transform: translateY(-8upx);
}

.book-image {
  width: 180upx;
  height: 270upx;
  border-radius: 16upx;
  box-shadow: 0 8upx 16upx rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.book-item:active .book-image {
  box-shadow: 0 12upx 24upx rgba(0, 0, 0, 0.2);
}

.book-name {
  font-size: 26upx;
  font-weight: 600;
  color: #333;
  margin-top: 12upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>