<template>
  <button @click="get_ai_recommendations">AI生成小说简介</button>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-bar">
      <input type="text" placeholder="搜索小说" v-model="searchText" class="search-input" />
      <button @click="searchNovel" class="search-btn">搜索</button>
    </view>

    <!-- 轮播图 -->
    <swiper class="swiper-box" :indicator-dots="true" :autoplay="true" interval="3000" duration="1000" circular="true">
      <swiper-item v-for="(item, index) in swiperList" :key="index">
        <image :src="item.Img_Url" class="swiper-img" @click="goToDetail(item)" />
      </swiper-item>
    </swiper>

    <!-- 小说主题分类 -->
    <view class="genre-list">
      <view class="section-title">小说主题分类</view>
      <view class="tag-list">
        <view class="tag-item" v-for="(item, index) in Booktopic.slice(0, 4)" :key="index" @click="filterByTag(item)">
          <text>{{ item }}</text>
        </view>
      </view>
    </view>

    <!-- 经典作品推荐 -->
    <view class="recommend-section">
      <view class="section-title">经典作品推荐</view>
      <scroll-view scroll-x class="book-list">
        <view class="book-item" v-for="(item, index) in classicBooks" :key="index" @click="goToDetail(item)">
          <image :src="item.Img_Url" mode="aspectFill" class="book-image" />
          <p class="book-name">{{ item.Book_Name }}</p>
        </view>
      </scroll-view>
    </view>

    <!-- 热门作品推荐 -->
    <view class="recommend-section">
      <view class="section-title">热门作品推荐</view>
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
        <text>AI智能推荐</text>
        <uni-icons type="sparkles" size="20" color="#ff6b6b" />
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

    <!-- 底部TabBar -->
    <!--    <view class="tabbar">
      <navigator url="/pages/index/index" hover-class="navigator-hover" @click="switchTab('/pages/index/index')">
        <text>首页</text>
      </navigator>
      <navigator url="/pages/Illustrated/Illustrated" hover-class="navigator-hover" @click="switchTab('/pages/Illustrated/Illustrated')">
        <text>分类</text>
      </navigator>
      <navigator url="/pages/user/user" hover-class="navigator-hover" @click="switchTab('/pages/user/user')">
        <text>我的</text>
      </navigator>
    </view> -->
  </view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Get_Swiper, Get_All_Books, Get_AI_Recommendations } from '@/api';
// import { uni } from '@dcloudio/uni-app';

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
    // 如果是超时错误，不显示错误提示，只在控制台记录
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
.container {
  padding-top: 20upx;
  background-color: #f5f5f5;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20upx;
  padding: 10upx 20upx;
  background-color: #fff;
  border-radius: 20upx;
  box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  height: 60upx;
  padding-left: 20upx;
  font-size: 28upx;
  color: #333;
  background-color: #f0f0f0;
  border: none;
  border-radius: 20upx;
}

.search-btn {
  padding: 0 30upx;
  font-size: 28upx;
  color: #fff;
  background-color: #007AFF;
  border-radius: 20upx;
  margin-left: 20upx;
}

.swiper-box {
  height: 300upx;
  overflow: hidden;
  margin: 20upx;
  border-radius: 10upx;
  box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.1);
}

.swiper-img {
  width: 100%;
  height: 100%;
  border-radius: 10upx;
}

.genre-list {
  margin: 20upx;
  padding: 20upx;
  background-color: #fff;
  border-radius: 10upx;
  box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 36upx;
  color: #333;
  margin-bottom: 20upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-recommend .section-title {
  color: #ff6b6b;
}

.no-recommendations {
  padding: 40upx;
  text-align: center;
  color: #999;
  font-size: 28upx;
}

.login-btn {
  margin-top: 20upx;
  background-color: #ff6b6b;
  color: white;
  border: none;
  padding: 10upx 30upx;
  border-radius: 20upx;
  font-size: 24upx;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-top: 20upx;
}

.tag-item {
  width: 100upx;
  height: 100upx;
  line-height: 100upx;
  display: inline-block;
  padding: 10upx 20upx;
  margin: 10upx;
  background-color: #e0e0e0;
  border-radius: 20upx;
  cursor: pointer;
  text-align: center;
}

.tag-item text {
  font-size: 24upx;
  color: #666;
}

.recommend-section {
  margin: 20upx;
  padding: 20upx;
  background-color: #fff;
  border-radius: 10upx;
  box-shadow: 0 2upx 10upx rgba(0, 0, 0, 0.1);
}

.book-list {
  white-space: nowrap;
  overflow-x: auto;
}

.book-item {
  display: inline-block;
  width: 200upx;
  margin-right: 20upx;
  text-align: center;
}

.book-image {
  width: 180upx;
  height: 270upx;
  border-radius: 10upx;
}

.book-name {
  font-size: 28upx;
  color: #333;
  margin-top: 10upx;
}

.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100upx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 -2upx 10upx rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.tabbar navigator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tabbar navigator text {
  font-size: 24upx;
  color: #666;
}
</style>