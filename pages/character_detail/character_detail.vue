<template>
	<view class="detail-container">
		<view v-if="character">
			<view class="header">
				<image :src="character[0].Role_Image" class="role-image"></image>
				<text style="position: absolute; top: 20px;left: 12%;color:darkorange;"
					class="title">{{ character[0].Role_Name }}</text>
				<view class="chart-wrapper">
					<l-echart ref="chartRef"></l-echart>
				</view>
			</view>
			<view class="info-section">
				<view class="">
					<text class="section-title">简介</text>
				</view>

				<text class="description">{{ character[0].Role_Introduction }}</text>
			</view>
			<view class="info-section taglist">
				<text class="section-title">标签</text>
				<text class="features tag" v-for="(item,index) in tag">{{ item || '暂无描述' }}</text>
			</view>
			<view class="info-section">
				<text class="section-title">主要经历</text>
				<!-- 				<view class="" v-for="(item,index) in Main_Contribute">
					·{{item}}
				</view> -->
				<!-- <text class="background-story">{{ character[0].Role_Background || '暂无描述' }}</text> -->
				<l-echart ref="chartRef_1"></l-echart>
				<view v-if="showPopup" class="popup">
					<view class="contribute_title">{{ popupData.name }}: </view>
					<view class="contribute_detail">
						{{ popupData.data.des }}
					</view>
					<!-- 这里可以放置更多有关点击项的详情信息 -->
					<button @click="showPopup = false">关闭</button>
				</view>
			</view>
			<view class="info-section quotes">
				<text class="section-title">经典语录</text>
				<view class="quotes-list">
					<view v-for="(item, index) in Classic_Quotes" :key="index" class="quote-item">
						<text class="quote-symbol">·</text>
						<text class="quote-text">{{ item }}</text>
					</view>
				</view>
			</view>

			<view class="related-characters" v-if="relatedCharacters.length">
				<text class="section-title">相关角色</text>
				<scroll-view class="related-list" scroll-x>
					<view class="related-card" v-for="char in relatedCharacters" :key="char.id"
						@click="navigateToCharacterDetail(char)">
						<image :src="char.realtion_Image" class="related-image"></image>
						<text class="related-name">{{ char.realtion_Name }}</text>
						<text class="related-description">{{ char.relation_Type || '暂无描述' }}</text>
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-else>
			<text>Loading...</text>
		</view>

	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue';
	import {
		onLoad
	} from '@dcloudio/uni-app';
	import {
		Get_Character_Detail,
		Get_Related_Characters
	} from "@/api"
	import * as echarts from 'echarts';
	const chartRef = ref(null);
	const chartRef_1 = ref(null);

	const showPopup = ref(false);
	const popupData = ref(null);

	const character = ref(null);
	const relatedCharacters = ref([]);
	let tag = ref([])
	let Contribute_List = ref([])
	let Classic_Quotes = ref([])
	onLoad(async (options) => {
		const id = options.id;
		character.value = await fetchCharacterById(id);
		relatedCharacters.value = []
		relatedCharacters.value = await fetchRelatedCharacters(id);
		// fetchRelatedCharacters(id);
		console.log(relatedCharacters.value);

		//获取人物标签
		if (character.value[0].Tag) {
			tag.value = character.value[0].Tag.split(',')
		}

		//获取人物主要经历
		for (const key in character.value[0]) {

			if (key.includes("Contribute") && character.value[0][key]) {
				let arr = character.value[0][key].split("|")
				let contribute_obj = {
					value: arr[0],
					name: arr[1],
					des: arr[2]
				}
				Contribute_List.value.push(contribute_obj)
				// console.log(contribute_obj);
			}
		}

		//获取经典语录
		if (character.value[0]["Classic_Quotes"]) {
			let arr1 = character.value[0]["Classic_Quotes"].split("|")
			Classic_Quotes.value = arr1;
		}

		// console.log(arr1);


		let option = {
			title: {
				text: ''
			},
			// legend: {
			// 	data: ['Allocated Budget', 'Actual Spending']
			// },
			radar: {
				// shape: 'circle',
				indicator: [{
						name: '战斗力',
						max: 100
					},
					{
						name: '智力',
						max: 100
					},
					{
						name: '决策',
						max: 100
					},
					{
						name: '影响力',
						max: 100
					},
					{
						name: '道德',
						max: 100
					},
					{
						name: '意志',
						max: 100
					}
				]
			},
			series: [{
				name: '能力',
				type: 'radar',
				data: [{
					value: [80, 99, 95, 99, 99, 99],
					name: '罗辑'
				}]
			}]
		};

		let option1 = {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: '5%',
				left: 'center',
				// margin:[100,0,0,0]
				padding: [0, 0,0,0], // [top, right] 或者 [top, right, bottom, left]
			},
			series: [{
				name: '主要经历',
				type: 'pie',
				radius: ['40%', '70%'],
				top:"40px",
				avoidLabelOverlap: false,
				padAngle: 5,
				itemStyle: {
					borderRadius: 10
				},
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 20,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				data: []
			}]
		};




		option.series[0].data = [character.value[0].Ability]
		option1.series[0].data = Contribute_List.value
		// console.log(option);
		setTimeout(async () => {
			if (!chartRef.value) return;
			const myChart = await chartRef.value.init(echarts);
			const myChart1 = await chartRef_1.value.init(echarts);
			myChart1.on('click', function(params) {
				console.log(params); // 查看控制台输出以了解 params 的结构
				popupData.value = params; // 假设你想要显示的信息都在 params 中
				showPopup.value = true; // 显示弹窗
			});
			myChart.setOption(option);
			myChart1.setOption(option1);
		}, 300);
	});
	//跳转到人物详情
	const navigateToCharacterDetail = (character) => {
		uni.navigateTo({
			url: `/pages/character_detail/character_detail?id=${character.realtion_ID}`
		});
	};


	async function fetchCharacterById(id) {
		const response = await uni.request({
			url: Get_Character_Detail,
			method: 'POST',
			data: {
				Character_ID: id
			}
		});
		return response.data;
	}

	async function fetchRelatedCharacters(id) {
		// 假设有一个API可以获取与特定角色相关的其他角色
		const response = await uni.request({
			url: Get_Related_Characters,
			method: 'POST',
			data: {
				Character_ID: id
			}
		});
		return response.data;
	}



	onMounted(() => {


	})
</script>

<style scoped>
	.related-list {
		display: flex;
		white-space: nowrap;
		overflow-x: auto;
		padding-bottom: 10px;
	}

	.related-card {
		flex-shrink: 0;
		width: 150px;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-right: 10px;
		text-align: center;
		transition: transform 0.3s ease;
		cursor: pointer;
		display: inline-block;
	}

	.related-card:hover {
		transform: scale(1.05);
	}

	.related-image {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.related-name {
		font-size: 16px;
		font-weight: bold;
		color: #333333;
		padding: 10px;
	}

	.related-description {
		font-size: 14px;
		color: #666666;
		padding: 0 10px 10px;
		line-height: 1.2;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		/* 控制显示行数 */
		-webkit-box-orient: vertical;
	}



	.related-image {
		width: 100%;
		height: 150px;
		object-fit: cover;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}


	.contribute_title {
		font-size: 20px;
	}

	.contribute_detail {
		/* margin-left: 10px; */
		color: #666666;
	}

	.taglist {
		display: flex;
		align-items: end;
		justify-content: space-around;
	}

	.tag {
		font-size: 12px!important;
		height: 35px;
		display: flex;
		align-items: center;
		justify-content: center;
		/* width: 15%; */
		
		background-color: aqua;
		/* margin-left: 5px; */
		padding: 5px;
		border-radius: 20px;
	}

	.chart-wrapper {
		width: 210px;
		height: 210px;
		/* 明确指定高度 */
		/* background-color: #ffffff; */
		/* margin-bottom: 5px; */
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
	}

	.detail-container {
		padding: 20px;
		background-color: #f9f9f9;
	}

	.header {
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 20px;
	}

	.role-image {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		margin-right: 20px;
	}

	.title {
		font-size: 24px;
		font-weight: bold;
		color: #333333;
	}

	.info-section {
		margin-bottom: 20px;
		padding: 15px;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.section-title {
		font-size: 18px;
		font-weight: bold;
		color: #333333;
		margin-bottom: 10px;
	}

	.description,
	.features,
	.background-story,
	.famous-quote {
		font-size: 16px;
		color: #666666;
		line-height: 1.5;
	}



	.related-list {
		white-space: nowrap;
	}

	.related-item {
		display: inline-block;
		margin-right: 10px;
	}

	.related-image {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		margin-bottom: 5px;
	}

	.related-name {
		font-size: 14px;
		text-align: center;
		color: #333333;
	}

	/* 引入新的样式 */
	.quotes {
		background-color: #f0f8ff;
		/* 轻微的背景色变化 */
		padding: 20px;
		border-radius: 8px;
	}

	.quotes-list {
		margin-top: 10px;
	}

	.quote-item {
		display: flex;
		align-items: center;
		margin-bottom: 15px;
		padding-left: 10px;
		position: relative;
	}

	.quote-symbol {
		font-size: 24px;
		color: darkorange;
		margin-right: 8px;
	}

	.quote-text {
		font-size: 16px;
		line-height: 1.5;
		color: #333;
	}

	.quote-item::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 3px;
		height: 70%;
		background-color: #dcdcdc;
		border-radius: 2px;
	}
</style>