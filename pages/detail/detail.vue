<template>
	<view class="container">
		<!-- 书籍详细信息 -->
		<view class="book-details">
			<view class="book-cover">
				<image :src="book.Img_Url" mode="aspectFit"></image>
			</view>
			<view class="book-info">
				<p class="book-title">{{ book.Book_Name }}</p>
				<p class="author">作者: {{ book.Author }}</p>
				<p class="topic">主题: {{ book.Topic }}</p>
				<p class="rating">
					<strong>评分:</strong>
					<uni-rate :touchable="false" v-model="book.Rating" />
				</p>
				<!-- 收藏按钮 -->
				<view class="favorite-button">
					<button @click="toggleFavorite" :class="{ 'favorited': isFavorited, 'custom-button': true }">
						{{ isFavorited ? '已收藏' : '收藏' }}
					</button>
				</view>
			</view>
			<view class="" style="position: relative;">
				<uni-icons @click="to_Illustrated" style="position: absolute;top: -130px;right:-20px"
					type="images-filled" size="50"></uni-icons>
				<text
					style="position: absolute;color: red;;font-size:15px; top:-90px;left:-20px;width: 40px;">图鉴</text>
			</view>
		</view>

		<!-- 书籍简介 -->
		<view class="book-description">
			<h2>书籍简介</h2>
			<p :class="{ 'expanded': isExpanded_book }" v-if="!isExpanded_book">{{ text_book }}...
				<a @click="isExpanded_book = !isExpanded_book"
					class="expand-link">{{ isExpanded_book ? '收起' : '展开' }}</a>
			</p>
			<p v-else>{{ book.Book_Introduce }}
				<a @click="isExpanded_book = !isExpanded_book"
					class="expand-link">{{ isExpanded_book ? '收起' : '展开' }}</a>
			</p>
		</view>

		<!-- 作者简介 -->
		<view class="author-biography">
			<h2>作者简介</h2>
			<p :class="{ 'expanded': isExpanded_author }" v-if="!isExpanded_author">{{ text_author }}...
				<a @click="isExpanded_author = !isExpanded_author"
					class="expand-link">{{ isExpanded_author ? '收起' : '展开' }}</a>
			</p>
			<p v-else>{{ book.Author_Introduction }}
				<a @click="isExpanded_author = !isExpanded_author"
					class="expand-link">{{ isExpanded_author ? '收起' : '展开' }}</a>
			</p>
		</view>

		<!-- 书籍简评 -->
		<view class="book-reviews">
			<h2>书籍简评</h2>
			<view class="review-item" v-for="(review, index) in book.Book_Comment" :key="index">
				<p><text style="color: blue;">{{review.Comment_User_NickName}}</text> <text
						style="color: coral;font-size: 13px;">{{review.Comment_Time}}</text> <uni-icons
						@click="deleteCommentStart(review.Book_Comment_ID)"
						v-if="review.Comment_User_Name==user.username" style="float: right;" type="trash"
						size="15"></uni-icons></p>
				<p>{{ review.Comment_Content }}</p>
			</view>
		</view>
		<!-- 发表评论 -->
		<view class="add-comment">
			<h2>发表评论</h2>
			<form>
				<textarea v-model="newComment.Content" placeholder="写下你的评论..." required></textarea>
				<button @click="submitComment" type="submit" class="custom-button submit-comment">提交评论</button>
			</form>
		</view>

		<!-- 分享按钮 -->
		<button data-name="shareBtn" open-type="share" class="custom-button share-button">转发</button>
	</view>
</template>


<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad,
		onShareAppMessage
	} from '@dcloudio/uni-app';
	import {
		Get_DetailBook,
		Collect_Book,
		UNCOLLECT_BOOK,
		GET_USER_COLLECT_BOOK,
		Insert_BrowseHistory,
		AddBook_Comment,
		DeleteBook_Comment
	} from '@/api'
	let isExpanded_book = ref(false);
	let isExpanded_author = ref(false);
	let isLoggedIn = ref(false);
	let book = ref({});
	let text_book = ref("")
	let text_author = ref("")
	let book1 = (uni.getStorageSync('NowBook'));
	let user = {};
	if (uni.getStorageSync('userInfo')) {
		isLoggedIn.value = true;
		user = JSON.parse(uni.getStorageSync('userInfo'));
	} else {
		isLoggedIn.value = false;
		user = {};
	}

	let isFavorited = ref(false);


	//点击跳转到图鉴
	function to_Illustrated() {
		uni.setStorageSync('NowIllustrated', book1);
		uni.navigateTo({
			url: `/pages/Illustrated_detail/Illustrated_detail?id=${book1.Book_ID}`
		});
	}

	//发送获取书籍详情的请求
	async function fetchBookDetails(bookId) {
		try {
			const response = await uni.request({
				url: Get_DetailBook,
				method: 'POST',
				data: {
					bookId
				}
			});
			book.value = response.data.data;
			text_book.value = response.data.data.Book_Introduce.slice(0, 90)
			text_author.value = response.data.data.Author_Introduction.slice(0, 60)
			console.log(response.data.data);
		} catch (error) {
			console.error('Error fetching book details:', error);
		}
	}
	//发送获取书籍收藏的请求
	async function fetchBookCollect() {
		try {
			const response = await uni.request({
				url: Collect_Book,
				method: 'POST',
				data: {
					User_Name: user.username,
					Book_ID: book1.Book_ID,
					Book_Name: book1.Book_Name,
					Collect_Time: gettime(),
					Img_Url: book1.Img_Url
				}
			});
		} catch (error) {
			console.error('Error fetching book collect:', error);
		}
	}

	//发送取消收藏的请求
	async function fetchBookCancelCollect() {
		try {
			const response = await uni.request({
				url: UNCOLLECT_BOOK,
				method: 'POST',
				data: {
					User_Name: user.username,
					Book_ID: book1.Book_ID,
					Book_Name: book1.Book_Name,
					Collect_Time: new Date()
				}
			});
		} catch (error) {
			console.error('Error fetching book collect:', error);
		}
	}

	//获取所有书籍
	async function getAllBookCollect() {
		try {
			const response = await uni.request({
				url: GET_USER_COLLECT_BOOK,
				method: 'POST',
				data: {
					User_Name: user.username,
				}
			});
			isFavorited.value = response.data.some((item) => item.Book_ID == book1.Book_ID);
		} catch (error) {
			console.error('Error fetching book collect:', error);
		}
	}

	//提示还未登录
	function toggleFavorite() {
		if (!isLoggedIn.value) {
			uni.showModal({
				title: '提示',
				content: '您尚未登录，是否前往登录页面？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: function(res) {
					if (res.confirm) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				}
			});
			return;
		}

		if (!isFavorited.value) {
			fetchBookCollect();
		} else {
			fetchBookCancelCollect();
		}

		isFavorited.value = !isFavorited.value;
	}

	//书籍浏览的请求
	async function BookBrowse() {
		try {
			const response = await uni.request({
				url: Insert_BrowseHistory,
				method: 'POST',
				data: {
					User_Name: user.username,
					Book_ID: book1.Book_ID,
					Book_Name: book1.Book_Name,
					Browse_Time: gettime(),
					Img_Url: book1.Img_Url
				}
			});
		} catch (error) {
			console.error('Error fetching book collect:', error);
		}
	}

	let goBack = () => {
		uni.navigateBack();
	};

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

	//分享功能
	onShareAppMessage((res) => {
		let shareObj = {
			title: book.value.Book_Name,
			path: `/pages/detail/detail?id=${JSON.stringify(book.value.Book_Id)}`,
			imageUrl: book.value.Img_Url,
			success: function(res) {
				if (res.errMsg === 'shareAppMessage:ok') {
					console.log('分享成功');
				}
			},
			fail: function(res) {
				if (res.errMsg === 'shareAppMessage:fail cancel') {
					console.log('用户取消分享');
				} else if (res.errMsg === 'shareAppMessage:fail') {
					console.error('分享失败:', res.errMsg);
				}
			},
			complete: function() {
				console.log('分享结束');
			}
		};

		if (res.from === 'button') {
			const eData = res.target.dataset;
			console.log(eData.name);
			shareObj.path = `/pages/btnname/btnname?btn_name=${eData.name}`;
		}

		return shareObj;
	});

	// 新增的评论内容
	let newComment = ref({
		Content: '',
		Comment_User_NickName: user.nickname || '匿名用户',
		Comment_Time: ''
	});

	// 提交评论的方法
	async function submitComment() {
		if (!isLoggedIn.value) {
			uni.showModal({
				title: '提示',
				content: '您尚未登录，是否前往登录页面？',
				showCancel: true,
				cancelText: '取消',
				confirmText: '确定',
				success: function(res) {
					if (res.confirm) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}
				}
			});
			return;
		}
		if (newComment.value.Content == '') {
			uni.showToast({
				title: '不能为空',
				icon: 'error',
				duration: 2000
			});
		}

		// 设置评论时间
		newComment.value.Comment_Time = gettime();

		try {
			const response = await uni.request({
				url: AddBook_Comment,
				method: 'POST',
				data: {
					Comment_User_Name: user.username,
					Comment_User_NickName: newComment.value.Comment_User_NickName,
					Book_ID: book1.Book_ID,
					Book_Name: book1.Book_Name,
					Comment_Content: newComment.value.Content,
					Comment_Time: newComment.value.Comment_Time
				}
			});

			// 成功后清空输入框并刷新评论列表
			newComment.value.Content = '';
			fetchBookDetails(book1.Book_ID); // 或者直接更新book对象中的评论数据
			console.log(response);
			if (response.statusCode == 200) {
				uni.showToast({
					title: '评论成功',
					icon: 'success',
					duration: 2000
				});
			}
		} catch (error) {
			console.error('Error submitting comment:', error);
			uni.showToast({
				title: '评论失败，请重试',
				icon: 'none',
				duration: 2000
			});
		}
	}

	//删除评论
	function deleteCommentStart(Book_Comment_ID) {
		uni.showModal({
			title: '提示',
			content: '您确定要删除吗？',
			showCancel: true,
			cancelText: '取消',
			confirmText: '确定',
			success: function(res) {
				if (res.confirm) {
					deleteComment(Book_Comment_ID)
				}
			}
		});
	}
	//删除评论
	async function deleteComment(Book_Comment_ID) {

		console.log(Book_Comment_ID);
		try {
			const response = await uni.request({
				url: DeleteBook_Comment,
				method: 'POST',
				data: {
					Comment_User_Name: user.username,
					Book_Comment_ID: Book_Comment_ID
				}
			})
			if (response.statusCode == 200) {
				uni.showToast({
					title: '删除成功',
					icon: 'success',
					duration: 2000
				});
			}
			fetchBookDetails(book1.Book_ID);
		} catch (error) {
			//TODO handle the exception
		}
	}


	//拿到其他页面传过来的书籍ID
	onLoad((options) => {
		const id = JSON.parse(options.id);
		getAllBookCollect();
		fetchBookDetails(id);
		BookBrowse();
	});
</script>

<style scoped>
	.container {
		padding: 20px;
		font-family: 'Helvetica Neue', Arial, sans-serif;
		background-color: #f4f4f4;
		min-height: 100vh;
		box-sizing: border-box;
		color: #333;
	}

	/* 返回按钮（隐藏的） */
	.back-button .custom-button {
		background-color: #4CAF50;
		color: white;
		border: none;
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 8px;
		transition: background-color 0.3s ease;
	}

	.back-button .custom-button:hover {
		background-color: #45a049;
	}

	/* 书籍详细信息部分 */
	.book-details {
		display: flex;
		align-items: center;
		margin-bottom: 30px;
		background-color: #ffffff;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.book-cover image {
		width: 120px;
		height: 200px;
		object-fit: cover;
		border-radius: 8px;
		margin-right: 20px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.book-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	.book-title {
		font-size: 28px;
		font-weight: bold;
		color: #333;
	}

	.author,
	.topic {
		font-size: 16px;
		color: #666;
	}

	.rating {
		display: flex;
		align-items: center;
		font-size: 16px;
		color: #666;
	}

	.favorite-button .custom-button {
		background-color: #ff6b6b;
		color: white;
		border: none;
		padding: 10px 20px;
		font-size: 16px;
		margin-top: 10px;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.favorite-button .custom-button.favorited {
		background-color: #007bff;
	}

	.favorite-button .custom-button:hover {
		background-color: #f55858;
	}

	/* 书籍简介、作者简介部分 */
	.book-description,
	.author-biography {
		margin-bottom: 20px;
		background-color: white;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.expand-link {
		color: #e74c3c;
		font-size: 16px;
		text-decoration: none;
	}

	h2 {
		font-size: 22px;
		margin-bottom: 10px;
		color: #333;
	}

	.expanded {
		white-space: normal;
		word-wrap: break-word;
	}

	p {
		line-height: 1.8;
		color: #666;
	}

	/* 书籍简评部分 */
	.book-reviews {
		margin-bottom: 30px;
	}

	.review-item {
		background-color: white;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		margin-bottom: 15px;
		font-size: 16px;
		color: #555;
	}

	/* 分享按钮 */
	.share-button {
		background-color: #3498db;
		color: white;
		padding: 12px 20px;
		border: none;
		font-size: 16px;
		border-radius: 8px;
		width: 100%;
		margin-top: 20px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.share-button:hover {
		background-color: #2980b9;
	}



	.add-comment {
		margin-bottom: 20px;
		background-color: white;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.add-comment h2 {
		font-size: 22px;
		margin-bottom: 10px;
		color: #333;
	}

	.add-comment textarea {
		width: 100%;
		height: 100px;
		padding: 10px;
		font-size: 16px;
		border: 1px solid #ddd;
		border-radius: 4px;
		resize: none;
		margin-bottom: 10px;
	}

	.submit-comment {
		background-color: #3498db;
		color: white;
		padding: 10px 20px;
		border: none;
		font-size: 16px;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.submit-comment:hover {
		background-color: #2980b9;
	}
</style>