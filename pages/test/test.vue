<template>
	<view class="page-container">
		<view class="header">
			<!-- <text class="title">《{{book.Book_Name}}》图鉴</text> -->
		</view>
		<view class="content">
			<view class="chart-wrapper">
				<l-echart ref="chartRef"></l-echart>
			</view>
			<view class="description-section">
				<text class="section-title">世界观介绍</text>
				<text class="section-content">这里可以是关于世界观的详细介绍。</text>
			</view>
			<view class="description-section">
				<text class="section-title">科技观介绍</text>
				<text class="section-content">这里可以是关于科技观的详细介绍。</text>
			</view>
		</view>
	</view>
</template>

<script>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

export default {
  setup() {
    const chartRef = ref(null);

    // Function to fetch and register the SVG map
    const fetchAndRegisterMap = async () => {
      try {
        const response = await uni.request({
          url: 'https://echarts.apache.org/examples/data/asset/geo/Map_of_Iceland.svg',
          method: "GET",
        });
		console.log(response);

        if (response && response.data) {
          const svg = response.data;
          echarts.registerMap('iceland_svg', { svg });

          // Define the chart options
          let option = {
            tooltip: {},
            geo: {
              tooltip: {
                show: true,
              },
              map: 'iceland_svg',
              roam: true,
            },
            series: {
              type: 'custom',
              coordinateSystem: 'geo',
              geoIndex: 0,
              zlevel: 1,
              data: [
                [488.2358421078053, 459.70913833075736, 100],
                [770.3415644319939, 757.9672194986475, 30],
                [1180.0329284196291, 743.6141808346214, 80],
                [894.03790632245, 1188.1985153835008, 61],
                [1372.98925630313, 477.3839988649537, 70],
                [1378.62251255796, 935.6708486282843, 81],
              ],
              renderItem(params, api) {
                const coord = api.coord([api.value(0, params.dataIndex), api.value(1, params.dataIndex)]);
                const circles = [];
                for (let i = 0; i < 5; i++) {
                  circles.push({
                    type: 'circle',
                    shape: {
                      cx: 0,
                      cy: 0,
                      r: 30,
                    },
                    style: {
                      stroke: 'red',
                      fill: 'none',
                      lineWidth: 2,
                    },
                    keyframeAnimation: {
                      duration: 4000,
                      loop: true,
                      delay: (-i / 4) * 4000,
                      keyframes: [
                        {
                          percent: 0,
                          scaleX: 0,
                          scaleY: 0,
                          style: { opacity: 1 },
                        },
                        {
                          percent: 1,
                          scaleX: 1,
                          scaleY: 0.4,
                          style: { opacity: 0 },
                        },
                      ],
                    },
                  });
                }
                return {
                  type: 'group',
                  x: coord[0],
                  y: coord[1],
                  children: [
                    ...circles,
                    {
                      type: 'path',
                      shape: {
                        d: 'M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z',
                        x: -10,
                        y: -35,
                        width: 20,
                        height: 40,
                      },
                      style: {
                        fill: 'red',
                      },
                      keyframeAnimation: {
                        duration: 1000,
                        loop: true,
                        delay: Math.random() * 1000,
                        keyframes: [
                          { y: -10, percent: 0.5, easing: 'cubicOut' },
                          { y: 0, percent: 1, easing: 'bounceOut' },
                        ],
                      },
                    },
                  ],
                };
              },
            },
          };

          // After the SVG is loaded, initialize the chart
          if (chartRef.value) {
            const myChart = await chartRef.value.init(echarts);
            myChart.setOption(option);
          }
        } else {
          console.error("Failed to fetch SVG data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Use the onMounted lifecycle hook to call the async function after the component is mounted
    onMounted(() => {
      fetchAndRegisterMap();  // Call the function after component is mounted
    });

    return {
      chartRef,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
