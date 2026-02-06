<template>
	<view class="user-center">
		<!-- 用户信息区域 -->
		<view class="user-info-card">
			<view class="background-decoration"></view>
			<image :src="userInfo.avatarUrl || '/static/default-avatar.png'" class="avatar" @click="chooseAvatar"></image>
			<view class="user-details">
				<p class="username">{{ userInfo.nickname || '未登录' }}</p>
				<p class="user-email" v-if="isLoggedIn">{{ userInfo.email }}</p>
				<button v-if="!isLoggedIn" @click="handleLogin" class="login-btn">登录/注册</button>
				<button v-else @click="logout" class="logout-btn">退出登录</button>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="function-list">
			<view class="function-item" @click="navigateTo('history')">
				<view class="function-icon">📚</view>
				<view class="function-content">
					<text class="function-title">浏览历史</text>
					<text class="function-desc">查看我的浏览记录</text>
				</view>
				<uni-icons type="forward" size="20" color="#999"></uni-icons>
			</view>
			<view class="function-item" @click="navigateTo('collect')">
				<view class="function-icon">❤️</view>
				<view class="function-content">
					<text class="function-title">我的收藏</text>
					<text class="function-desc">我收藏的小说</text>
				</view>
				<uni-icons type="forward" size="20" color="#999"></uni-icons>
			</view>
			<view class="function-item" @click="navigateTo('profile')">
				<view class="function-icon">⚙️</view>
				<view class="function-content">
					<text class="function-title">个人资料</text>
					<text class="function-desc">修改个人信息</text>
				</view>
				<uni-icons type="forward" size="20" color="#999"></uni-icons>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	onMounted
} from 'vue';
import { User_Avatar, Get_Userinfo } from '@/api';

let isLoggedIn = ref(false);
let userInfo = ref({
	avatarUrl: "",
	email: "",
	id: 0,
	nickname: "",
	username: "",
});

const handleLogin = () => {
	uni.navigateTo({
		url: '/pages/login/login'
	});
};

const chooseAvatar = async () => {
	if (!isLoggedIn.value) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		});
		return;
	}
	const res = await uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera']
	});
	if (res.tempFilePaths.length > 0) {
		updateUserAvatar(res.tempFilePaths[0]);
	}
};

const updateUserAvatar = async (filePath) => {
	const result = await uni.uploadFile({
		url: User_Avatar,
		filePath: filePath,
		name: 'file',
		header: {
			Authorization: `Bearer ${uni.getStorageSync('token')}`
		}
	});
	if (result.statusCode === 200) {
		const data = JSON.parse(result.data);
		if (data.success) {
			userInfo.value.avatarUrl = data.avatarUrl;
			uni.showToast({
				title: '头像更新成功',
				icon: 'success'
			});
		} else {
			uni.showToast({
				title: '头像更新失败',
				icon: 'none'
			});
		}
	} else {
		uni.showToast({
			title: '网络请求失败',
			icon: 'none'
		});
	}
};

const logout = async () => {
	uni.removeStorageSync("token")
	uni.removeStorageSync("userInfo")
	isLoggedIn.value = false;
	userInfo.value = {};
	uni.showToast({
		title: '退出成功',
		duration: 2000
	});
};

const navigateTo = (page) => {
	if (!isLoggedIn.value) {
		uni.showToast({
			title: '请先登录',
			icon: 'none'
		});
		return;
	}
	uni.navigateTo({
		url: `/pages/${page}/${page}`
	});
};

onMounted(async () => {
	const user = await uni.request({
		url: Get_Userinfo,
		method: 'GET',
		header: {
			Authorization: `Bearer ${uni.getStorageSync('token')}`
		}
	});
	console.log(user);
	if (user.statusCode == 200) {
		isLoggedIn.value = true;
		userInfo.value = user.data.userInfo;
	}
});
</script>

<style scoped>
.user-center {
	min-height: 100vh;
	background: linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%);
	padding: 20px;
}

/* 用户信息卡片 */
.user-info-card {
	position: relative;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40px 24px 30px;
	border-radius: 24px;
	box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
	margin-bottom: 24px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.background-decoration {
	position: absolute;
	top: -50px;
	right: -50px;
	width: 200px;
	height: 200px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 50%;
}

.avatar {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	border: 4px solid rgba(255, 255, 255, 0.3);
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
	margin-bottom: 16px;
	position: relative;
	z-index: 1;
}

.user-details {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

.username {
	font-size: 28px;
	font-weight: 700;
	color: #ffffff;
	margin-bottom: 8px;
	text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-email {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.9);
	margin-bottom: 16px;
}

.login-btn,
.logout-btn {
	padding: 12px 32px;
	border: 2px solid #ffffff;
	background: rgba(255, 255, 255, 0.2);
	color: #ffffff;
	border-radius: 30px;
	font-size: 16px;
	font-weight: 600;
	backdrop-filter: blur(10px);
	transition: all 0.3s ease;
}

.login-btn:active,
.logout-btn:active {
	background: rgba(255, 255, 255, 0.3);
	transform: scale(0.95);
}

/* 功能列表 */
.function-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.function-item {
	display: flex;
	align-items: center;
	padding: 20px;
	background: #ffffff;
	border-radius: 16px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
}

.function-item:active {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.function-icon {
	width: 48px;
	height: 48px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 28px;
	background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
	border-radius: 12px;
	margin-right: 16px;
}

.function-content {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.function-title {
	font-size: 16px;
	font-weight: 600;
	color: #333;
	margin-bottom: 4px;
}

.function-desc {
	font-size: 13px;
	color: #999;
}
</style>