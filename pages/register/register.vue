<template>
	<view class="register-page">
		<h1>注册</h1>
		<form @submit="handleRegister">
			<label for="username">昵称：</label>
			<input type="text" v-model="nickname" required />

			<label for="username">用户名：</label>
			<input type="text" v-model="username" required />

			<label for="email">邮箱：</label>
			<input type="email" v-model="email" required />

			<label for="password">密码：</label>
			<input type="password" v-model="password" required />

			<button form-type="submit">注册</button>
		</form>
		<p><button @click="navigateToLogin">已有账号？去登录</button></p>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import { User_Register } from '@/api'; // 假设这是你的用户API模块
	// import { showToast } from '@/utils/utils'; // 假设这是一个通用的提示函数

	let username = ref('');
	let email = ref('');
	let password = ref('');
	let nickname = ref('');

	const handleRegister = async () => {
		try {
			const response = await uni.request({
				url: User_Register,
				method: 'POST',
				data: {
					username: username.value,
					email: email.value,
					password: password.value,
					nickname: nickname.value
				}
			});
			if (response.statusCode==200) {
				// 注册成功，提示用户并跳转到登录页面
				uni.showToast({
					title:'注册成功，请登录',
					duration:2000
				});
				uni.navigateTo({
					url: '/pages/login/login'
				});
			} else {
				// console.log(response);
				uni.showToast({
					title:'注册失败,'+response.data.error,
					icon:"error",
					duration:2000
				});
			}
		} catch (error) {
			// alert('网络请求失败')
			
			uni.showToast({
					title:'网络请求失败',
					icon:"error",
					duration:2000
				});
			
		}
	};

	const navigateToLogin = () => {
		uni.navigateTo({
			url: '/pages/login/login'
		});
	};
</script>

<style scoped>
	.register-page {
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