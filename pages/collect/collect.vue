<template>
	<view class="collect-page">
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		<view v-else-if="collections.length === 0" class="empty">
			<view class="empty-icon">📚</view>
			<text class="empty-text">暂无收藏记录</text>
			<text class="empty-hint">快去收藏喜欢的小说吧</text>
		</view>
		<view v-else class="collections">
			<view class="collection-list">
				<view v-for="item in collections" :key="item.Book_ID" class="collection-item">
					<view class="cover" @click="viewItem(item.Book_ID)">
						<image :src="item.Img_Url" class="cover-image"></image>
					</view>
					<view class="info">
						<text class="book-name">{{ item.Book_Name }}</text>
						<text class="collect-time">{{ item.Collect_Time }}</text>
					</view>
					<view class="action">
						<button @click="removeFromCollection(item.Book_ID)" class="remove-btn">取消收藏</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { GET_USER_COLLECT_BOOK, UNCOLLECT_BOOK } from '@/api';
import {
	ref,
	onMounted
} from 'vue';

const loading = ref(true);
const collections = ref([]);
const user = JSON.parse(uni.getStorageSync('userInfo'));

const fetchCollections = async () => {
	try {
		const response = await uni.request({
			url: GET_USER_COLLECT_BOOK,
			method: 'POST',
			data: {
				User_Name: user.username,
			}
		});
		collections.value = response.data;
	} catch (error) {
		uni.showToast({
			title: '加载失败,请稍后再试',
			icon: 'none'
		});
	} finally {
		loading.value = false;
	}
};

const viewItem = (id) => {
	uni.navigateTo({
		url: `/pages/detail/detail?id=${id}`
	});
};

const removeFromCollection = async (bookId) => {
	try {
		const response = await uni.request({
			url: UNCOLLECT_BOOK,
			method: 'POST',
			data: {
				User_Name: user.username,
				Book_ID: bookId
			}
		});
		console.log(response);
		if (response.statusCode == 200) {
			uni.showToast({
				title: '取消收藏成功',
				icon: 'success'
			});
			collections.value = collections.value.filter(item => item.Book_ID !== bookId);
		} else {
			uni.showToast({
				title: '取消收藏失败',
				icon: 'none'
			});
		}
	} catch (error) {
		uni.showToast({
			title: '网络请求失败',
			icon: 'none'
		});
	}
};

onMounted(() => {
	fetchCollections();
});
</script>

<style scoped>
.collect-page {
	min-height: 100vh;
	padding: 20px;
	background: linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%);
}

.loading,
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 80px 20px;
	text-align: center;
}

.empty-icon {
	font-size: 80px;
	margin-bottom: 20px;
	opacity: 0.5;
}

.empty-text {
	font-size: 18px;
	font-weight: 600;
	color: #666;
	margin-bottom: 8px;
}

.empty-hint {
	font-size: 14px;
	color: #999;
}

.collection-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.collection-item {
	display: flex;
	align-items: center;
	background: #ffffff;
	padding: 16px;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
}

.collection-item:active {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.cover {
	flex-shrink: 0;
	cursor: pointer;
}

.cover-image {
	width: 70px;
	height: 105px;
	border-radius: 12px;
	object-fit: cover;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.info {
	flex: 1;
	padding: 0 16px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.book-name {
	font-size: 16px;
	font-weight: 600;
	color: #333;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.collect-time {
	font-size: 13px;
	color: #999;
}

.action {
	flex-shrink: 0;
}

.remove-btn {
	padding: 10px 20px;
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	color: white;
	border: none;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 600;
	box-shadow: 0 4px 8px rgba(245, 87, 108, 0.3);
	transition: all 0.3s ease;
}

.remove-btn:active {
	transform: scale(0.95);
}
</style>