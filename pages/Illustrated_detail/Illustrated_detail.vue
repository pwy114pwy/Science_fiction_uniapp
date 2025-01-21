<template>
	<view class="page-container">
		<view class="header">
			<text class="title">《{{book.Book_Name}}》图鉴</text>
		</view>
		<view class="description-section">
			<text class="section-title">世界观介绍</text>
			<scroll-view class="worldviews-container" scroll-x="true">
				<view v-for="(worldview, index) in worldviews_show" :key="index" class="worldview-item">
					<view class="worldview-title">{{ worldview.Worldview_Title }}</view>
					<text class="worldview-content"
						:class="{ 'collapsed': !expanded[index] }">{{ worldview.Worldview_Description }}</text>
					<button @click="toggleExpand(index)"
						class="expand-button">{{ expanded[index] ? '收起' : '展开' }}</button>
				</view>
			</scroll-view>
		</view>
		<view class="content">
			<view class="all_btn">
				<!-- 人物关系展示按钮 -->
				<view  class="relational_btn">
					<button  @click="relational_btn">人物关系网</button>
				</view>
				<!-- 时间线展示按钮 -->
				<view  class="timeline_btn">
					<button @click="timeline_btn">重要事件时间线</button>
				</view>
				<!-- 科技水平按钮 -->
				<view  class="science_btn">
					<button @click="science_btn">科技水平介绍</button>
				</view>
				<!-- 评论区按钮 -->
				<view  class="discussion_btn">
					<button @click="discussion_btn">进入评论区</button>
				</view>
			</view>
			
			<!-- 人物关系网 -->
			<view v-show="show_relational" class="chart-wrapper">
				<uni-icons @click="relational_btn" style="position: absolute;right: 5px;top:5px;color: red;" type="closeempty" size="30"></uni-icons>
				<l-echart ref="chartRef"></l-echart>
			</view>
			
			

			<!-- 重要事件时间线 -->
			<view v-show="show_timeline" class="timeline-section">
				<uni-icons @click="timeline_btn" style="position: absolute;right: 5px;top:5px;color: red;" type="closeempty" size="30"></uni-icons>
				<text class="section-title">重要事件时间线</text>
				<view  class="timeline-wrapper">
					<l-echart ref="timelineChartRef"></l-echart>
				</view>
			</view>
		</view>

		<!-- 浮窗 -->
		<view class="overlay" v-if="showOverlay">
			<view class="modal">
				<view class="modal-header">
					<text class="modal-title">{{ selectedWorldview.Worldview_Title }}</text>
					<button @click="closeModal" class="close-button">X</button>
				</view>
				<view class="modal-body">
					<text class="modal-description">{{ selectedWorldview.Worldview_Description }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		computed
	} from 'vue';
	import {
		onLoad,
		onShareAppMessage
	} from '@dcloudio/uni-app';
	import {
		Get_CharactersAndRelationships,
		Get_Event,
		Get_Worldview
	} from '@/api';
	import * as echarts from 'echarts';

	const chartRef = ref(null);
	const timelineChartRef = ref(null);
	let book = uni.getStorageSync('NowIllustrated');
	const worldviews = ref([]);
	const worldviews_show = ref([]);
	const expanded = ref([]);
	
	//浮窗展示
	const showOverlay = ref(false);
	const selectedWorldview = ref({});

	//人物关系展示
	const show_relational = ref(false);
	
	//时间线
	const show_timeline = ref(false);

	onMounted(async () => {
		try {
			// 获取世界观
			const response_word = await uni.request({
				url: Get_Worldview,
				method: "POST",
				data: {
					Illustrated_ID: uni.getStorageSync('NowIllustrated').Book_ID,
				}
			});
			worldviews.value = response_word.data;
			worldviews_show.value = worldviews.value.map(item => ({
				Worldview_Title: item.Worldview_Title,
				Worldview_Description: item.Worldview_Description.slice(0, 50) + (item
					.Worldview_Description.length > 50 ? '...' : ''),
				fullDescription: item.Worldview_Description
			}));
			console.log(worldviews_show.value);
			expanded.value = response_word.data.map(() => false); // 初始化所有世界观为折叠状态
			console.log(response_word);

			// 获取人物关系
			const response = await uni.request({
				url: Get_CharactersAndRelationships,
				method: 'POST',
				data: {
					Illustrated_ID: uni.getStorageSync('NowIllustrated').Book_ID,
				}
			});

			const option = {
				title: {
					text: '人物关系网'
				},
				tooltip: {},
				animationDurationUpdate: 1500,
				animationEasingUpdate: 'quinticInOut',
				series: [{
					type: 'graph',
					layout: 'none',
					symbolSize: 40,
					label: {
						show: true
					},
					edgeLabel: {
						fontSize: 15
					},
					data: [],
					links: [],
					lineStyle: {
						opacity: 0.9,
						width: 2,
						curveness: 0
					}
				}]
			};

			const {
				characters,
				relationships
			} = response.data;
			option.series[0].data = characters.map(character => ({
				c_id: character.id,
				name: character.name,
				x: character.x,
				y: character.y
			}));

			option.series[0].links = relationships.map(relationship => ({
				source: relationship.from,
				target: relationship.to,
				label: {
					show: true,
					formatter: relationship.label
				},
				lineStyle: {
					curveness: 0.2
				}
			}));

			setTimeout(async () => {
				if (!chartRef.value) return;
				const myChart = await chartRef.value.init(echarts);
				myChart.setOption(option);

				myChart.on('click', async function(params) {
					if (params.seriesType === 'graph' && params.dataType === 'node') {
						const characterId = params.data.c_id;
						uni.navigateTo({
							url: `/pages/character_detail/character_detail?id=${characterId}`
						});
					}
				});
			}, 300);

			const response1 = await uni.request({
				url: Get_Event,
				method: "POST",
				data: {
					Illustrated_ID: uni.getStorageSync('NowIllustrated').Book_ID
				}
			});

			const timelineOption = {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line'
					}
				},
				toolbox: {
					feature: {
						saveAsImage: {}
					}
				},
				legend: {
					data: ['事件']
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: response1.data.map(item => item.Event_Time),
					axisLabel: {
						rotate: 45,
						interval: 0
					}
				},
				yAxis: {
					type: 'value',
					name: '重要性评分',
					min: 0,
					max: 10,
					splitLine: {
						show: false
					}
				},
				series: [{
					name: '事件',
					type: 'line',
					symbol: 'circle',
					symbolSize: function(val) {
						return val[1] * 5;
					},
					data: response1.data.map(item => [item.Event_Time, item.Event_Value]),
					itemStyle: {
						color: '#ff7f50'
					},
					markPoint: {
						data: response1.data.filter(item => item.Event_Value > 7).map(item => ({
							coord: [item.Event_Time, item.Event_Value],
							value: item.Event_Description
						}))
					}
				}],
				dataZoom: [{
						type: 'slider',
						xAxisIndex: 0,
						filterMode: 'empty',
						start: 0,
						end: 100,
					},
					{
						type: 'inside',
						xAxisIndex: 0,
						start: 0,
						end: 100,
					}
				],
				grid: {
					bottom: 90,
				}
			};

			setTimeout(async () => {
				if (!timelineChartRef.value) return;
				const myTimelineChart = await timelineChartRef.value.init(echarts);
				myTimelineChart.setOption(timelineOption);

				myTimelineChart.on('click', function(params) {
					if (params.seriesType === 'line') {
						const selectedEvent = response1.data.find(item => item
							.Event_Time === params.name);
						if (selectedEvent) {
							uni.showToast({
								title: `${selectedEvent.Event_Description}`,
								icon: 'none',
								duration: 5000
							});
						}
					}
				});
			}, 300);

		} catch (error) {
			console.error("Error fetching data:", error);
		}
	});
	
	//人物关系展示按钮
	function relational_btn(){
		show_relational.value=!show_relational.value
		show_timeline.value=false
	}
	
	//时间线展示按钮
	function timeline_btn(){
		show_timeline.value=!show_timeline.value
		show_relational.value=false
	}
	//跳转科技水平介绍按钮
	function science_btn(){
		uni.navigateTo({
			url: `/pages/science_rate/science_rate?id=${book.Book_ID}`
		});
	}

	//跳转评论区按钮
	function discussion_btn(){
		uni.navigateTo({
			url: `/pages/discussion/discussion?id=${book.Book_ID}`
		});
	}
	
	function toggleExpand(index) {
		if (expanded.value[index]) {
			expanded.value[index] = false;
		} else {
			selectedWorldview.value = worldviews.value[index];
			showOverlay.value = true;
		}
	}

	function closeModal() {
		showOverlay.value = false;
	}

	onLoad((options) => {
		const id = JSON.parse(options.id);
	});
</script>

<style scoped>

	.all_btn{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		margin-bottom: 10px;
	}
	
	.relational_btn{
		width: 100px;
		height: 120px;
		button{
			display: flex;
			align-items: center;
			height: 100%;
			background-color: aquamarine;
		}
	}
	.timeline_btn{
		width: 100px;
		height: 120px;
		button{
			display: flex;
			align-items: center;
			height: 100%;
			background-color: pink;
		}
	}
	.science_btn{
		width: 100px;
		height: 120px;
		button{
			display: flex;
			align-items: center;
			height: 100%;
			background-color: skyblue;
		}
	}
	.discussion_btn{
		width: 100px;
		height: 120px;
		button{
			display: flex;
			align-items: center;
			height: 100%;
			background-color: darkorchid;
		}
	}
	
	
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #f8f9fa;
		position: relative;
	}

	.header {
		padding: 24px;
		background-color: #ffffff;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid #e9ecef;
	}

	.title {
		font-size: 28px;
		font-weight: bold;
		color: #343a40;
		text-align: center;
	}

	.content {
		height: 100%;
		flex-grow: 1;
		overflow-y: auto;
		padding: 24px;
	}

	.chart-wrapper,
	.timeline-section,
	.description-section {
		position: relative;
		background-color: #ffffff;
		margin-bottom: 24px;
		padding: 24px;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.timeline-wrapper {
		width: 100%;
		min-height: 300px;
		touch-action: none;
	}

	.section-title {
		font-size: 22px;
		font-weight: bold;
		color: #343a40;
		margin-bottom: 16px;
	}

	.worldviews-container {
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		overflow-x: auto;
	}

	.worldview-item {
		display: inline-block;
		flex-shrink: 0;
		margin-right: 24px;
		padding: 16px;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 250px;
		/* Adjust the width as needed */
	}

	.worldview-title {
		font-size: 18px;
		font-weight: bold;
		color: #343a40;
		margin-bottom: 8px;
	}

	.worldview-content {
		font-size: 16px;
		color: #6c757d;
		line-height: 1.6;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		max-height: 54px;
		/* Adjust based on line height and number of lines */
		transition: max-height 0.3s ease-in-out;
	}

	.worldview-content.collapsed {
		-webkit-line-clamp: 3;
		max-height: 54px;
		/* Adjust based on line height and number of lines */
	}

	.expand-button {
		margin-top: 8px;
		padding: 8px 16px;
		background-color: #007aff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.expand-button:active {
		background-color: #0056b3;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal {
		background-color: #ffffff;
		padding: 24px;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		width: 80%;
		max-width: 600px;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16px;
	}

	.modal-title {
		font-size: 24px;
		font-weight: bold;
		color: #343a40;
	}

	.close-button {
		padding: 8px 16px;
		background-color: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.close-button:active {
		background-color: #c82333;
	}

	.modal-body {
		font-size: 16px;
		color: #6c757d;
		line-height: 1.6;
	}
</style>



