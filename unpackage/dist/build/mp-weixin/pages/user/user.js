"use strict";const e=require("../../common/vendor.js"),a=require("../../api.js"),o={__name:"user",setup(o){let t=e.ref(!1),n=e.ref({avatarUrl:"",email:"",id:0,nickname:"",username:""});const i=()=>{e.index.navigateTo({url:"/pages/login/login"})},r=async()=>{if(!t.value)return void e.index.showToast({title:"请先登录",icon:"none"});const a=await e.index.chooseImage({count:1,sizeType:["compressed"],sourceType:["album","camera"]});a.tempFilePaths.length>0&&s(a.tempFilePaths[0])},s=async o=>{const t=await e.index.uploadFile({url:a.User_Avatar,filePath:o,name:"file",header:{Authorization:`Bearer ${e.index.getStorageSync("token")}`}});if(200===t.statusCode){const a=JSON.parse(t.data);a.success?(n.value.avatarUrl=a.avatarUrl,e.index.showToast({title:"头像更新成功",icon:"success"})):e.index.showToast({title:"头像更新失败",icon:"none"})}else e.index.showToast({title:"网络请求失败，请检查您的网络连接",icon:"none"})},c=async()=>{e.index.removeStorageSync("token"),e.index.removeStorageSync("userInfo"),t.value=!1,n.value={},e.index.showToast({title:"退出成功",duration:2e3})},l=a=>{t.value?e.index.navigateTo({url:`/pages/${a}/${a}`}):e.index.showToast({title:"请先登录",icon:"none"})};return e.onMounted((async()=>{const o=await e.index.request({url:a.Get_Userinfo,method:"GET",header:{Authorization:`Bearer ${e.index.getStorageSync("token")}`}});console.log(o),200==o.statusCode&&(t.value=!0,n.value=o.data.userInfo)})),(a,o)=>e.e({a:e.unref(n).avatarUrl,b:e.o(r),c:e.t(e.unref(n).nickname),d:!e.unref(t)},e.unref(t)?{f:e.o(c)}:{e:e.o(i)},{g:e.o((e=>l("history"))),h:e.o((e=>l("collect"))),i:e.o((e=>l("profile")))})}},t=e._export_sfc(o,[["__scopeId","data-v-0ee55bc5"]]);wx.createPage(t);
