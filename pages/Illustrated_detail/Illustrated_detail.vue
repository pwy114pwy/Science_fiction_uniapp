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
	/* 按钮容器 */
	.all_btn {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		gap: 16px;
		margin-bottom: 20px;
		padding: 0 12px;
	}
	
	/* 按钮基础样式 */
	.relational_btn,
	.timeline_btn,
	.science_btn,
	.discussion_btn {
		flex: 1;
		min-width: 150px;
		max-width: 180px;
		height: 140px;
	}
	
	.relational_btn button,
	.timeline_btn button,
	.science_btn button,
	.discussion_btn button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		width: 100%;
		height: 100%;
		border: none;
		border-radius: 16px;
		font-size: 15px;
		font-weight: 600;
		color: #ffffff;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}
	
	/* 按钮悬停效果 */
	.relational_btn button:active,
	.timeline_btn button:active,
	.science_btn button:active,
	.discussion_btn button:active {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
	}
	
	/* 人物关系网按钮 - 紫蓝渐变 */
	.relational_btn button {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
	
	.relational_btn button::before {
		content: '👥';
		font-size: 32px;
	}
	
	/* 时间线按钮 - 粉橙渐变 */
	.timeline_btn button {
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
	}
	
	.timeline_btn button::before {
		content: '⏱️';
		font-size: 32px;
	}
	
	/* 科技水平按钮 - 蓝绿渐变 */
	.science_btn button {
		background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
	}
	
	.science_btn button::before {
		content: '🚀';
		font-size: 32px;
	}
	
	/* 评论区按钮 - 紫粉渐变 */
	.discussion_btn button {
		background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
	}
	
	.discussion_btn button::before {
		content: '💬';
		font-size: 32px;
	}

	/* 页面容器 */
	.page-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%);
		position: relative;
	}

	/* 头部 */
	.header {
		padding: 28px 24px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
		position: relative;
		overflow: hidden;
	}
	
	.header::before {
		content: '';
		position: absolute;
		top: -50%;
		right: -10%;
		width: 200px;
		height: 200px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
	}

	.title {
		font-size: 26px;
		font-weight: 700;
		color: #ffffff;
		text-align: center;
		letter-spacing: 0.5px;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 1;
	}

	/* 内容区域 */
	.content {
		flex-grow: 1;
		overflow-y: auto;
		padding: 20px 16px;
	}

	/* 图表和时间线容器 */
	.chart-wrapper,
	.timeline-section,
	.description-section {
		position: relative;
		background: #ffffff;
		margin-bottom: 20px;
		padding: 24px;
		border-radius: 20px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}
	
	.chart-wrapper:active,
	.timeline-section:active {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
	}

	.timeline-wrapper {
		width: 100%;
		min-height: 300px;
		touch-action: none;
	}

	/* 章节标题 */
	.section-title {
		font-size: 20px;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 16px;
	}

	/* 世界观容器 */
	.worldviews-container {
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		overflow-x: auto;
		padding-bottom: 8px;
		-webkit-overflow-scrolling: touch;
	}
	
	.worldviews-container::-webkit-scrollbar {
		height: 6px;
	}
	
	.worldviews-container::-webkit-scrollbar-thumb {
		background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
		border-radius: 3px;
	}

	/* 世界观卡片 */
	.worldview-item {
		display: inline-block;
		flex-shrink: 0;
		margin-right: 16px;
		padding: 20px;
		background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		width: 260px;
		border: 1px solid rgba(102, 126, 234, 0.1);
		transition: all 0.3s ease;
	}
	
	.worldview-item:active {
		transform: translateY(-4px);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
	}

	.worldview-title {
		font-size: 18px;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 12px;
	}

	.worldview-content {
		font-size: 14px;
		color: #64748b;
		line-height: 1.7;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		max-height: 63px;
		transition: max-height 0.3s ease-in-out;
	}

	.worldview-content.collapsed {
		-webkit-line-clamp: 3;
		max-height: 63px;
	}

	/* 展开按钮 */
	.expand-button {
		margin-top: 12px;
		padding: 8px 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 20px;
		font-size: 13px;
		font-weight: 600;
		box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
		transition: all 0.3s ease;
	}

	.expand-button:active {
		transform: scale(0.95);
		box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
	}

	/* 遮罩层 */
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.3s ease;
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* 模态框 */
	.modal {
		background: #ffffff;
		padding: 28px;
		border-radius: 24px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		width: 85%;
		max-width: 600px;
		max-height: 80vh;
		overflow-y: auto;
		animation: slideUp 0.3s ease;
	}
	
	@keyframes slideUp {
		from {
			transform: translateY(50px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 2px solid #f1f5f9;
	}

	.modal-title {
		font-size: 22px;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* 关闭按钮 */
	.close-button {
		padding: 8px 16px;
		background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
		color: white;
		border: none;
		border-radius: 20px;
		font-weight: 600;
		box-shadow: 0 4px 8px rgba(245, 87, 108, 0.3);
		transition: all 0.3s ease;
	}

	.close-button:active {
		transform: scale(0.95);
		box-shadow: 0 2px 4px rgba(245, 87, 108, 0.3);
	}

	.modal-body {
		font-size: 15px;
		color: #475569;
		line-height: 1.8;
	}
</style>
