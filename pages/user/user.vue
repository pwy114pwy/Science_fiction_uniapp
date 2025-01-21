<template>
	<view class="user-center">
		<!-- 用户信息区域 -->
		<view class="user-info">
			
			<image :src="userInfo.avatarUrl" class="avatar" @click="chooseAvatar"></image>
			<view class="user-details">
				<p class="username">{{ userInfo.nickname }}</p>
				<button v-if="!isLoggedIn" @click="handleLogin">登录/注册</button>
				<button v-else @click="logout">退出登录</button>
			</view>
		</view>

		<!-- 功能列表 -->
		<view class="function-list">
			<view class="function-item" @click="navigateTo('history')">
				<text>浏览历史</text>
			</view>
			<view class="function-item" @click="navigateTo('collect')">
				<text>我的收藏</text>
			</view>
			<view class="function-item" @click="navigateTo('profile')">
				<text>个人资料</text>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import { User_Avatar,Get_Userinfo } from '@/api'; // 假设这里是你处理用户相关请求的API

	let isLoggedIn = ref(false);
	let userInfo = ref({
		avatarUrl: "",
		email: "",
		id: 0,
		nickname: "",
	    username: "",
	});

	const handleLogin = () => {
		// 这里可以跳转到登录或注册页面
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
	    // 上传图片到服务器并更新用户头像
	    updateUserAvatar(res.tempFilePaths[0]);
	  }
	};
	
	const updateUserAvatar = async (filePath) => {
	  // 调用API更新用户头像
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
	      title: '网络请求失败，请检查您的网络连接',
	      icon: 'none'
	    });
	  }
	};

	const logout = async () => {
		// await uni.request({
		// 	url: `http://127.0.0.1:3000/api/user/logout`,
		// 	method: 'POST',
		// 	header: {
		// 		Authorization: `Bearer ${uni.getStorageSync('token')}`
		// 	}
		// });
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
		// 页面加载时尝试获取用户信息
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
		padding: 20px;
	}

	.user-info {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}

	.avatar {
		width: 60px;
		height: 60px;
		border-radius: 50%;
		margin-right: 15px;
	}

	.user-details {
		flex: 1;
	}

	.function-list {
		display: flex;
		flex-direction: column;
	}

	.function-item {
		padding: 10px 0;
		border-bottom: 1px solid #eee;
	}

	.function-item:last-child {
		border-bottom: none;
	}
</style>