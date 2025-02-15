<template>
	<view class="collect-page">
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		<view v-else-if="history.length === 0" class="empty">
			<text>暂无历史记录</text>
		</view>
		<view v-else class="history">
			<button @click="clearAllHistory" class="clear-btn">清空所有记录</button>
			<view class="history-list">
				<view v-for="item in history" :key="item.Book_ID" class="history-item">
					<view class="cover" @click="viewItem(item.Book_ID)">
						<image :src="item.Img_Url" class="cover-image"></image>
					</view>
					<view class="info">
						<p><text class="book-name">{{ item.Book_Name }}</text></p>
						<text class="browse-time">{{ item.Browse_Time }}</text>
					</view>
					<view class="action">
						<button @click="removeFromHistory(item.Book_ID)" class="delete-btn">删除记录</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		Get_All_BrowseHistory,
		Delete_BrowseHistory,
		Clear_AllBrowseHistory
	} from "@/api"
	const loading = ref(true);
	const history = ref([]);
	const user = JSON.parse(uni.getStorageSync('userInfo'));

	const fetchBrowse = async () => {
		try {
			const response = await uni.request({
				url: Get_All_BrowseHistory,
				method: 'POST',
				data: {
					User_Name: user.username,
				}
			});
			history.value = response.data;
			console.log(history.value);
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

	const removeFromHistory = async (bookId) => {
		try {
			const response = await uni.request({
				url: Delete_BrowseHistory,
				method: 'POST',
				data: {
					User_Name: user.username,
					Book_ID: bookId
				}
			});
			console.log(response);
			if (response.statusCode == 200) {
				uni.showToast({
					title: '删除记录成功',
					icon: 'success'
				});
				// 更新本地数据
				history.value = history.value.filter(item => item.Book_ID !== bookId);
			} else {
				uni.showToast({
					title: '删除记录失败，请稍后再试',
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

	const clearAllHistory = async () => {
		try {
			const response = await uni.request({
				url: Clear_AllBrowseHistory,
				method: 'POST',
				data: {
					User_Name: user.username
				}
			});
			console.log(response);
			if (response.statusCode == 200) {
				uni.showToast({
					title: '清空记录成功',
					icon: 'success'
				});
				// 清空本地数据
				history.value = [];
			} else {
				uni.showToast({
					title: '清空记录失败，请稍后再试',
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
		fetchBrowse();
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

	.history-list {
		display: flex;
		flex-direction: column;
		gap: 20px;
		margin-top: 20px;
	}

	.history-item {
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 15px;
		border-radius: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.history-item:hover {
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

	.browse-time {
		font-size: 14px;
		color: #666;
		margin-top: 5px;
	}

	.action {
		flex: 1;
		text-align: right;
	}

	.delete-btn {
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

	.delete-btn:hover {
		background-color: #e53935;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}

	.clear-btn {
		background-color: #ff9800;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		margin-bottom: 20px;
		transition: background-color 0.3s;
	}

	.clear-btn:hover {
		background-color: #e68a00;
	}
</style>