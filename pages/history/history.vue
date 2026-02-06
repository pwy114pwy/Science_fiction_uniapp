<template>
	<view class="history-page">
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>
		<view v-else-if="history.length === 0" class="empty">
			<view class="empty-icon">📖</view>
			<text class="empty-text">暂无浏览历史</text>
			<text class="empty-hint">开始探索精彩的科幻世界吧</text>
		</view>
		<view v-else class="history">
			<button @click="clearAllHistory" class="clear-btn">清空所有记录</button>
			<view class="history-list">
				<view v-for="item in history" :key="item.Book_ID" class="history-item">
					<view class="cover" @click="viewItem(item.Book_ID)">
						<image :src="item.Img_Url" class="cover-image"></image>
					</view>
					<view class="info">
						<text class="book-name">{{ item.Book_Name }}</text>
						<text class="browse-time">{{ item.Browse_Time }}</text>
					</view>
					<view class="action">
						<button @click="removeFromHistory(item.Book_ID)" class="delete-btn">删除</button>
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
			history.value = history.value.filter(item => item.Book_ID !== bookId);
		} else {
			uni.showToast({
				title: '删除记录失败',
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

const clearAllHistory = async () => {
	uni.showModal({
		title: '确认清空',
		content: '确定要清空所有浏览历史吗?',
		success: async (res) => {
			if (res.confirm) {
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
						history.value = [];
					} else {
						uni.showToast({
							title: '清空记录失败',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '网络请求失败',
						icon: 'none'
					});
				}
			}
		}
	});
};

onMounted(() => {
	fetchBrowse();
});
</script>

<style scoped>
.history-page {
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

.clear-btn {
	width: 100%;
	padding: 14px 24px;
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	color: white;
	border: none;
	border-radius: 30px;
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 20px;
	box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
	transition: all 0.3s ease;
}

.clear-btn:active {
	transform: scale(0.98);
}

.history-list {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.history-item {
	display: flex;
	align-items: center;
	background: #ffffff;
	padding: 16px;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
}

.history-item:active {
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

.browse-time {
	font-size: 13px;
	color: #999;
}

.action {
	flex-shrink: 0;
}

.delete-btn {
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

.delete-btn:active {
	transform: scale(0.95);
}
</style>