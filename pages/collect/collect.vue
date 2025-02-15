<template>
	<view class="collect-page">
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		<view v-else-if="collections.length === 0" class="empty">
			<text>暂无收藏记录</text>
		</view>
		<view v-else class="collections">
			<view class="collection-list">
				<view v-for="item in collections" :key="item.Book_ID" class="collection-item">
					<view class="cover" @click="viewItem(item.Book_ID)">
						<image :src="item.Img_Url" class="cover-image"></image>
					</view>
					<view class="info">
						<p> <text class="book-name">{{ item.Book_Name }}</text></p>
						<text class="collect-time">{{ item.Collect_Time }}</text>
					</view>
					<view class="action">
						<button @click="removeFromCollection(item.Book_ID)" class="remove-btn">取消</button>
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
				title: '加载失败，请稍后再试',
				icon: 'none'
			});
		} finally {
			loading.value = false;
		}
	};

	const viewItem = (id) => {
		// 这里可以根据id导航到详细页面
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
				// 更新本地数据
				collections.value = collections.value.filter(item => item.Book_ID !== bookId);
			} else {
				uni.showToast({
					title: '取消收藏失败，请稍后再试',
					icon: 'none'
				});
			}
		} catch (error) {
			uni.showToast({
				title: '网络请求失败，请检查您的网络连接',
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
		padding: 20px;
		background-color: #f5f5f5;
		font-family: 'Arial', sans-serif;
	}

	.loading,
	.empty {
		text-align: center;
		padding: 20px;
		color: #999;
		font-size: 16px;
	}

	.collection-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.collection-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.collection-item:hover {
		transform: translateY(-5px);
	}

	.cover {
		flex: 1;
		cursor: pointer;
	}

	.cover-image {
		width: 60px;
		height: 90px;
		border-radius: 5px;
		object-fit: cover;
	}

	.info {
		flex: 2;
		padding-left: 10px;
	}

	.book-name {
		font-size: 18px;
		color: #333;
		font-weight: bold;
		margin: 0;
	}

	.collect-time {
		font-size: 14px;
		color: #666;
		margin-top: 5px;
	}

	.action {
		flex: 1;
		text-align: right;
	}

	.remove-btn {
		background-color: #ff4d4f;
		color: white;
		border: none;
		padding: 8px 15px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 14px;
		transition: background-color 0.3s;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	}

	.remove-btn:hover {
		background-color: #e53935;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
</style>