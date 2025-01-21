<template>
  <view class="container">
    <!-- 武器列表 -->
    <block v-for="(weapon, index) in weapons" :key="index">
      <view @click="openPopup(weapon)" class="mini-weapon-item">
        <image :src="weapon.Science_Image" mode="widthFix" class="mini-weapon-image"></image>
        <text class="mini-weapon-title">{{ weapon.Science_Name }}</text>
      </view>
    </block>

    <!-- 自定义弹窗 -->
    <transition name="popup-fade">
      <view v-if="isPopupVisible" class="popup-overlay" @click.self="closePopup">
        <view class="popup-content">
          <image :src="selectedWeapon.Science_Image" mode="widthFix" class="popup-weapon-image"></image>
          <text class="popup-weapon-title">{{ selectedWeapon.Science_Name }}</text>
          <text class="popup-weapon-description">{{ selectedWeapon.Science_description }}</text>
          
          <!-- 属性评分 -->
          <view class="popup-ratings">
            <view v-for="(value, key) in selectedWeapon.ratings" :key="key" class="popup-rating-item">
				<text>{{key}}:</text><uni-rate :touchable="false" :value="value"/>
            </view>
          </view>

          <button @click="closePopup">关闭</button>
        </view>
      </view>
    </transition>
  </view>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import {Get_Science} from "@/api"
// 假设这是从服务器获取的数据
const weapons = ref([]);

const isPopupVisible = ref(false);
const selectedWeapon = ref({});

function openPopup(weapon) {
  selectedWeapon.value = weapon;
  isPopupVisible.value = true;
}

function closePopup() {
  isPopupVisible.value = false;
}
onMounted(async()=>{
	let response =await uni.request({
		url:Get_Science,
		method:"POST",
		data:{
			Illustrated_ID: uni.getStorageSync('NowIllustrated').Book_ID
		}
	}) 
	let arr=response.data;
	for (let s of arr) {
		let obj={
			"力量":s.Science_Rating_Strength,
			"速度":s.Science_Rating_Speed,
			"智能":s.Science_Rating_Intelligence,
			"耐久":s.Science_Rating_Durability,
		}
		s['ratings']=obj
	}
	weapons.value=arr
	// console.log(arr);
})
</script>

<style>
/* 更小的武器项 */
.container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 10px;
}

.mini-weapon-item {
  width: 30%; /* 每行大约能放三个 */
  margin: 5px;
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
}

.mini-weapon-image {
  width: 100%;
  max-height: 80px;
  border-radius: 8px;
}

.mini-weapon-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

/* 弹窗样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 80%;
  max-width: 400px;
}

.popup-weapon-image {
  width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

.popup-weapon-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
}

.popup-weapon-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-top: 10px;
}

.popup-ratings {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
}

.popup-rating-item {
	
  /* display: block; */
  display: flex;
  margin-bottom: 5px;
}

button {
  margin-top: 20px;
}

/* 动画 */
.popup-fade-enter-active,
.popup-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.popup-fade-enter-from,
.popup-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>