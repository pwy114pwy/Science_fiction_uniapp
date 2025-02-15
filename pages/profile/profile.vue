<template>
	<view>
		<!-- 修改信息部分 -->
		<view class="edit_info">
			<view class="info-label" @click="toggleInfo">
				<uni-icons type="down" size="30" v-if="isInfoCollapsed"></uni-icons>
				<uni-icons type="up" size="30" v-else></uni-icons>
				{{ isInfoCollapsed ? '修改个人信息' : '个人信息：' }}
			</view>

			<view v-show="!isInfoCollapsed" class="input-btn-container">
				<view style="display: flex; " class="">
					<span style="width: 47px;padding-top: 10px;">昵称:</span>
					<input v-model="nickname" type="text" :disabled="isdisabled" class="nickname-input" />
				</view>
				<view style="display: flex; " class="">
					<span style="width: 47px;padding-top: 10px;">邮箱:</span>
					<input v-model="email" type="text" :disabled="isdisabled" class="nickname-input" />
				</view>


				<view class="btn-container" v-if="isdisabled">
					<button class="btn-edit" @click="change_info">修改信息</button>
				</view>
				<view class="btn-container" v-else>
					<view class="" style="display: flex;">
						<button class="btn-confirm" @click="confirm_change">确定</button>
						<button class="btn-cancel" @click="cancel_change">取消</button>
					</view>
					
				</view>
			</view>
		</view>

		<!-- 修改密码部分 -->
		<view class="edit_password">
			<view class="password-label" @click="togglePassword">
				<uni-icons type="down" size="30" v-if="isPasswordCollapsed"></uni-icons>
				<uni-icons type="up" size="30" v-else></uni-icons>
				{{ isPasswordCollapsed ? '修改密码' : '修改密码：' }}
			</view>

			<view v-show="!isPasswordCollapsed" class="input-btn-container">
				<input v-model="oldPassword" type="password" placeholder="请输入原密码" class="password-input" />

				<input v-model="newPassword" type="password" placeholder="请输入新密码" class="password-input" />

				<input v-model="confirmPassword" type="password" placeholder="确认新密码" class="password-input" />
			</view>

			<view v-show="!isPasswordCollapsed" class="btn-container">
				<button class="btn-confirm" @click="confirm_password_change">确认修改</button>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {Change_Userinfo,Get_Userinfo,Change_Password} from '@/api'
	let userinfo = JSON.parse(uni.getStorageSync('userInfo'))
	let nickname = ref(userinfo.nickname)
	let email = ref(userinfo.email)
	let oldPassword = ref('')
	let newPassword = ref('')
	let confirmPassword = ref('')
	let isdisabled = ref('true')
	let username = userinfo.username

	// 控制折叠状态
	let isInfoCollapsed = ref(true)
	let isPasswordCollapsed = ref(true)

	// 修改昵称相关函数
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

	// 修改密码相关函数
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
			// 向服务器验证原密码并更新新密码
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
				// 重置密码输入框
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
				title: '请求失败，请稍后再试',
				icon: 'none',
				duration: 2000
			});
		}
	}

	// 切换昵称模块展开/折叠
	function toggleInfo() {
		isInfoCollapsed.value = !isInfoCollapsed.value;
	}

	// 切换密码模块展开/折叠
	function togglePassword() {
		isPasswordCollapsed.value = !isPasswordCollapsed.value;
	}
</script>

<style lang="scss">
	/* 样式部分 */
	.edit_info,
	.edit_password {
		margin-top: 10px;
		width: 100%;
		padding: 20px;
		background-color: #f7f7f7;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
	}

	.info-label,
	.password-label {
		font-size: 18px;
		color: #333;
		margin-bottom: 10px;
		cursor: pointer;
	}

	.input-btn-container {
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 500px;
		flex-direction: column;
	}

	.nickname-input,
	.password-input {
		width: 300px;
		padding: 10px;
		// padding-left: 0;
		margin-right: 50px;
		font-size: 15px;
		border: 1px solid #ddd;
		border-radius: 8px;
		outline: none;
		background-color: #fff;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
		margin-bottom: 10px;

		&:focus {
			border-color: #4a90e2;
			box-shadow: 0 0 5px rgba(74, 144, 226, 0.6);
		}
	}

	.btn-container {
		width: 100%;
		display: flex;
		justify-content: flex-stat;
		gap: 10px;
		margin-top: 10px;
		margin-right: 30px;
	}

	/* 按钮样式 */
	.btn-confirm {
		padding: 10px 20px;
		font-size: 16px;
		color: white;
		background-color: #28a745;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
		margin-left: 120px;
		
		&:hover {
			background-color: #218838;
		}
	}

	.btn-cancel {
		margin-left: 10px;
		padding: 10px 20px;
		// margin-right: 30px;
		font-size: 16px;
		color: white;
		background-color: #dc3545;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;

		&:hover {
			background-color: #c82333;
		}
	}

	/* 修改信息按钮 */
	.btn-edit {
		padding: 10px 30px;
		// margin-right: 25px;
		font-size: 15px;
		color: white;
		background-color: #007BFF;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;

		&:hover {
			background-color: #0056b3;
		}
	}
</style>