<template>
	<view class="login-page">
		<h1>登录</h1>
		<form @submit="handleLogin">

			<label for="username">用户名：</label>
			<input type="text" v-model="username" required />

			<label for="password">密码：</label>
			<input type="password" v-model="password" required />

			<button form-type="submit">登录</button>
		</form>
		<p><button @click="navigateToRegister">没有账号？去注册</button></p>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import { User_Login } from '@/api'; // 假设这是你的用户API模块
	// import { showToast } from '@/utils/utils'; // 假设这是一个通用的提示函数

	let username = ref('');
	let password = ref('');

	const handleLogin = async () => {
		try {
			const response = await uni.request({
				url: User_Login,
				method: 'POST',
				data: {
					username: username.value,
					password: password.value,
				}
			})
			console.log(response);
			if (response.statusCode==200) {
				uni.showToast({
					title:'登录成功'
				});
				// 登录成功，保存用户信息并跳转到首页
				uni.setStorageSync('token', response.data.token);
				uni.setStorageSync('userInfo', JSON.stringify(response.data.user));
				uni.reLaunch({
					url: '/pages/index/index'
				});
				
			} else {
				// showToast(response.message || '登录失败');
				uni.showToast({
					title:'登录失败,'+response.data.error,
					icon:"error",
					duration:2000
				});
			}
		} catch (error) {
			// showToast('网络请求失败');
			uni.showToast({
				title:'网络请求失败',
				icon:"error",
				duration:2000
			});
		}
	};

	const navigateToRegister = () => {
		uni.navigateTo({
			url: '/pages/register/register'
		});
	};
</script>

<style scoped>
	.login-page {
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 300px;
	}

	label {
		margin-top: 10px;
	}

	input {
		padding: 10px;
		margin-top: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	button {
		margin-top: 20px;
		padding: 10px;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>