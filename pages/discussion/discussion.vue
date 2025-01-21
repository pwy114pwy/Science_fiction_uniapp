<template>
	<view class="container">
		<div class="comment-section">
			<div v-for="(comment, index) in comments" :key="index" class="comment-item">
				<div class="comment-header">
					<span class="comment-author">{{ comment.Discussion_User_NickName }}</span>
					<span class="comment-time">{{ comment.Discussion_Time }}</span>
					
					<!-- 删除评论 -->
					<uni-icons v-if="comment.Discussion_User_ID==user.id" @click="deleteCommentStart(comment.Discussion_ID)" type="trash" size="18" class="delete-icon"></uni-icons>
				</div>
				<p class="comment-content">{{ comment.Discussion_Content }}</p>
				<button @click="toggleReplies(comment)" class="toggle-replies-button">
					{{ comment.showReplies ? '收起回复' : '展开回复'}}
					<i :class="['fas', 'fa-angle-' + (comment.showReplies ? 'up' : 'down')]" />
				</button>
				<transition name="fade">
					<div v-if="!comment.Discussion_Parent_ID && comment.showReplies" class="replies">
						<div v-for="(reply, replyIndex) in comment.child_discuss" :key="replyIndex"
							class="comment-reply">
							<view class="reply-header">
								<span class="comment-author">{{ reply.Discussion_User_NickName }}</span>
								<span class="comment-time">{{ reply.Discussion_Time }}</span>
								<!-- 删除评论 -->
								<uni-icons v-if="reply.Discussion_User_ID==user.id" @click="deleteCommentStart(reply.Discussion_ID)" type="trash" size="18" class="delete-icon"></uni-icons>
							</view>
							<p class="comment-content">{{ reply.Discussion_Content }}</p>
						</div>
						<input type="text" v-model="comment_val" placeholder="请输入回复内容" class="input-field" />
						<button @click="addReply(comment)" class="submit-button">发表回复</button>
					</div>
				</transition>
			</div>
		</div>
	</view>
	<view class="bottom-ipt">
		<input type="text" v-model="comment_bottom_val" placeholder="请输入评论内容" class="" style="width: 280px;"/>
		<button @click="addReply_bottom(comment)" class="" style=" width: 100px;height: 50px;display: flex;align-items: center;justify-content: center;">发表评论</button>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		Get_Discussion,
		Add_Discussion,
		Delete_Discussion
	} from '@/api'
	import {
		use
	} from 'echarts';
	// import uniRequest from '@dcloudio/uni-request';

	let user = JSON.parse(uni.getStorageSync("userInfo")); // 当前用户信息
	console.log(user);
	let comments = ref([]);
	let comment_val = ref("")
	let comment_bottom_val = ref("")

	//获取当前时间
	let gettime = () => {
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		let seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
		return year + "年" + month + "月" + day + "日" + hours + ":" + minutes + ":" + seconds;
	}
	
	//删除评论
	function deleteCommentStart(Discussion_ID) {
		uni.showModal({
			title: '提示',
			content: '您确定要删除吗？',
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: function(res) {
				if (res.confirm) {
					deletecomment(Discussion_ID)
				}
			}
		});
	}
	
	//删除评论
	async function deletecomment(Discussion_ID){
		try {
			const response3 = await uni.request({
				url: Delete_Discussion,
				method: "POST",
				data: {
					Discussion_ID: Discussion_ID,
					Discussion_User_ID:user.id
				}
			})
			console.log(response3);
			if(response3.statusCode==200){
				uni.showToast({
					icon:"success",
					title:"删除成功"
				})
				fetchComments()
			}
			console.log(response3);
		} catch (error) {
			console.error('删除评论失败:', error);
		}
	}


	// 获取评论列表
	async function fetchComments() {
		try {
			const response = await uni.request({
				url: Get_Discussion,
				method: "POST",
				data: {
					Illustrated_ID: uni.getStorageSync('NowIllustrated').Book_ID,
				}
			})
			console.log(response.data);
			comments.value = response.data
		} catch (error) {
			console.error('获取评论失败:', error);
		}
	}

	// 添加回复
	async function addReply(comment) {
		console.log(user);
		if (user && comment_val.value) {
			try {
				// console.log(comment.Discussion_Parent_ID);
					const response1 = await uni.request({
						url: Add_Discussion,
						method: "POST",
						data: {
							"Illustrated_ID": comment.Illustrated_ID,
							"Illustrated_Name": comment.Illustrated_ID,
							"Discussion_User_ID": user.id,
							"Discussion_User_NickName": user.nickname,
							"Discussion_Parent_ID": comment.Discussion_ID,
							"Discussion_Content": comment_val.value,
							"Discussion_Time": gettime()
						}
					})
					if(response1.statusCode==200){
						uni.showToast({
							icon:"success",
							title:"回复成功"
						})
						comment_val.value=""
						fetchComments()
					}

			} catch (error) {
				console.error('添加回复失败:', error);
			}
		} else {
			console.log('请先登录或填写回复内容');
		}
	}

	// 添加底部回复
	async function addReply_bottom() {
		console.log(user);
		if (user && comment_bottom_val.value) {
			try {
				// console.log(comment.Discussion_Parent_ID);
					const response2 = await uni.request({
						url: Add_Discussion,
						method: "POST",
						data: {
							"Illustrated_ID": uni.getStorageSync('NowIllustrated').Book_ID,
							"Illustrated_Name": uni.getStorageSync('NowIllustrated').Book_Name,
							"Discussion_User_ID": user.id,
							"Discussion_User_NickName": user.nickname,
							"Discussion_Parent_ID": 0,
							"Discussion_Content": comment_bottom_val.value,
							"Discussion_Time": gettime()
						}
					})
					if(response2.statusCode==200){
						uni.showToast({
							icon:"success",
							title:"评论成功"
						})
						comment_bottom_val.value=""
						fetchComments()
					}

			} catch (error) {
				console.error('添加评论失败:', error);
			}
		} else {
			console.log('请先登录或填写回复内容');
		}
	}

	// 展开/收起回复
	function toggleReplies(comment) {
		comment.showReplies = !comment.showReplies;
	}

	onMounted(() => {
		fetchComments()
		// fetchUser();
		// fetchComments();
	});
</script>

<style scoped>
	body {
		font-family: 'Roboto', sans-serif;
		background-color: #f4f7fc;
	}

	.container {
		max-width: 900px;
		margin: auto;
		padding: 2rem;
	}

	.comment-section {
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		padding: 2rem;
	}

	.comment-item {
		border-bottom: 1px solid #eaeaea;
		padding: 1rem 0;
	}

	.comment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.comment-author {
		font-weight: bold;
		color: #333;
		font-size: 1.1rem;
	}

	.comment-time {
		color: #777;
		font-size: 0.9rem;
	}

	.toggle-replies-button {
		background-color: transparent;
		border: none;
		color: #007bff;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.toggle-replies-button:hover {
		text-decoration: underline;
	}

	.comment-content {
		margin-top: 0.5rem;
		line-height: 1.6;
		color: #555;
		font-size: 1rem;
	}

	.replies {
		margin-top: 1rem;
		padding-left: 1rem;
		border-left: 2px solid #ddd;
	}

	.comment-reply {
		margin-bottom: 1rem;
	}

	.reply-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.input-field {
		width: 100%;
		height: 40px;
		margin-bottom: 1rem;
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		transition: border-color 0.3s ease;
		font-size: 1rem;
	}

	.input-field:focus {
		outline: none;
		border-color: #007bff;
	}

	.submit-button {
		background-color: #007bff;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		cursor: pointer;
		transition: background-color 0.3s ease;
		font-size: 1rem;
	}

	.submit-button:hover {
		background-color: #0056b3;
	}

	.bottom-ipt {
		position: fixed;
		bottom: 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 10px;
		background-color: #fff;
		box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
	}

	.bottom-ipt input {
		width: 80%;
		border-radius: 4px;
		border: 1px solid #ccc;
		padding: 10px;
		font-size: 1rem;
	}

	.bottom-ipt button {
		width: 18%;
		border-radius: 4px;
		border: none;
		background-color: #007bff;
		color: white;
		padding: 10px;
		font-size: 1rem;
		cursor: pointer;
	}

	.bottom-ipt button:hover {
		background-color: #0056b3;
	}

	.delete-icon {
		cursor: pointer;
		color: #d9534f;
	}

	.delete-icon:hover {
		color: #c9302c;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}

	.fade-enter, .fade-leave-to {
		opacity: 0;
	}
</style>