<template>
	<view class="profile-page">
		<!-- 修改信息部分 -->
		<view class="edit-section">
			<view class="section-header" @click="toggleInfo">
				<view class="header-left">
					<view class="icon-wrapper">
						<uni-icons :type="isInfoCollapsed ? 'down' : 'up'" size="24" color="#667eea"></uni-icons>
					</view>
					<text class="section-title">{{ isInfoCollapsed ? '修改个人信息' : '个人信息' }}</text>
				</view>
			</view>

			<view v-show="!isInfoCollapsed" class="section-content">
				<view class="input-group">
					<view class="input-label">昵称</view>
					<input v-model="nickname" type="text" :disabled="isdisabled" class="custom-input" placeholder="请输入昵称" />
				</view>
				<view class="input-group">
					<view class="input-label">邮箱</view>
					<input v-model="email" type="text" :disabled="isdisabled" class="custom-input" placeholder="请输入邮箱" />
				</view>

				<view class="btn-container" v-if="isdisabled">
					<button class="btn-primary" @click="change_info">修改信息</button>
				</view>
				<view class="btn-container" v-else>
					<button class="btn-success" @click="confirm_change">确定</button>
					<button class="btn-cancel" @click="cancel_change">取消</button>
				</view>
			</view>
		</view>

		<!-- 修改密码部分 -->
		<view class="edit-section">
			<view class="section-header" @click="togglePassword">
				<view class="header-left">
					<view class="icon-wrapper">
						<uni-icons :type="isPasswordCollapsed ? 'down' : 'up'" size="24" color="#667eea"></uni-icons>
					</view>
					<text class="section-title">{{ isPasswordCollapsed ? '修改密码' : '修改密码' }}</text>
				</view>
			</view>

			<view v-show="!isPasswordCollapsed" class="section-content">
				<view class="input-group">
					<view class="input-label">原密码</view>
					<input v-model="oldPassword" type="password" placeholder="请输入原密码" class="custom-input" />
				</view>
				<view class="input-group">
					<view class="input-label">新密码</view>
					<input v-model="newPassword" type="password" placeholder="请输入新密码" class="custom-input" />
				</view>
				<view class="input-group">
					<view class="input-label">确认密码</view>
					<input v-model="confirmPassword" type="password" placeholder="确认新密码" class="custom-input" />
				</view>

				<view class="btn-container">
					<button class="btn-primary" @click="confirm_password_change">确认修改</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref
} from 'vue';
import { Change_Userinfo, Get_Userinfo, Change_Password } from '@/api'
let userinfo = JSON.parse(uni.getStorageSync('userInfo'))
let nickname = ref(userinfo.nickname)
let email = ref(userinfo.email)
let oldPassword = ref('')
let newPassword = ref('')
let confirmPassword = ref('')
let isdisabled = ref('true')
let username = userinfo.username

let isInfoCollapsed = ref(true)
let isPasswordCollapsed = ref(true)

function change_info() {
	isdisabled.value = false;
}

async function confirm_change() {
	isdisabled.value = true;
	try {
		const response = await uni.request({
			url: Change_Userinfo,
			method: 'POST',
			data: {
				username: username,
				new_nickname: nickname.value,
				new_email: email.value,
			}
		})
		if (response.statusCode == 200) {
			uni.showToast({
				title: '修改成功',
				icon: "success",
				duration: 2000
			});
			const response1 = await uni.request({
				url: Get_Userinfo,
				method: 'GET',
				header: {
					Authorization: `Bearer ${uni.getStorageSync('token')}`
				}
			})
			uni.setStorageSync('userInfo', JSON.stringify(response1.data.userInfo));
			console.log(response1);
		}
	} catch {
		console.log('请求失败');
	}
}

function cancel_change() {
	isdisabled.value = true;
	nickname.value = userinfo.nickname
	email.value = userinfo.email
}

async function confirm_password_change() {
	if (newPassword.value !== confirmPassword.value) {
		uni.showToast({
			title: '新密码与确认密码不一致',
			icon: 'none',
			duration: 2000
		});
		return;
	}

	try {
		const response = await uni.request({
			url: Change_Password,
			method: 'POST',
			data: {
				username: username,
				old_password: oldPassword.value,
				new_password: newPassword.value
			},
			header: {
				Authorization: `Bearer ${uni.getStorageSync('token')}`
			}
		})
		console.log(response);

		if (response.statusCode == 200) {
			uni.showToast({
				title: '密码修改成功',
				icon: 'success',
				duration: 2000
			});
			oldPassword.value = '';
			newPassword.value = '';
			confirmPassword.value = '';
		} else {
			uni.showToast({
				title: '原密码错误',
				icon: 'none',
				duration: 2000
			});
		}
	} catch {
		uni.showToast({
			title: '请求失败,请稍后再试',
			icon: 'none',
			duration: 2000
		});
	}
}

function toggleInfo() {
	isInfoCollapsed.value = !isInfoCollapsed.value;
}

function togglePassword() {
	isPasswordCollapsed.value = !isPasswordCollapsed.value;
}
</script>

<style scoped>
.profile-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%);
	padding: 20px;
}

/* 编辑区域 */
.edit-section {
	background: #ffffff;
	border-radius: 20px;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
	margin-bottom: 20px;
	overflow: hidden;
}

.section-header {
	padding: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	cursor: pointer;
	transition: background 0.3s ease;
}

.section-header:active {
	background: #f8f9fa;
}

.header-left {
	display: flex;
	align-items: center;
	gap: 12px;
}

.icon-wrapper {
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
	border-radius: 12px;
}

.section-title {
	font-size: 18px;
	font-weight: 700;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.section-content {
	padding: 0 20px 20px;
}

/* 输入组 */
.input-group {
	margin-bottom: 16px;
}

.input-label {
	font-size: 14px;
	font-weight: 600;
	color: #666;
	margin-bottom: 8px;
}

.custom-input {
	width: 100%;
	padding: 14px 16px;
	font-size: 15px;
	border: 2px solid #e2e8f0;
	border-radius: 12px;
	background-color: #fff;
	transition: all 0.3s ease;
	box-sizing: border-box;
}

.custom-input:focus {
	border-color: #667eea;
	outline: none;
	box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.custom-input:disabled {
	background-color: #f8f9fa;
	color: #999;
}

/* 按钮容器 */
.btn-container {
	display: flex;
	gap: 12px;
	margin-top: 20px;
}

/* 按钮样式 */
.btn-primary,
.btn-success,
.btn-cancel {
	flex: 1;
	padding: 14px 24px;
	font-size: 16px;
	font-weight: 600;
	color: white;
	border: none;
	border-radius: 30px;
	transition: all 0.3s ease;
}

.btn-primary {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-success {
	background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.btn-cancel {
	background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

.btn-primary:active,
.btn-success:active,
.btn-cancel:active {
	transform: scale(0.95);
}
</style>