"use strict";const e=require("../../common/vendor.js"),i=require("../../api.js"),f={__name:"user",setup(g){let a=e.ref(!1),n=e.ref({avatarUrl:"",email:"",id:0,nickname:"",username:""});const c=()=>{e.index.navigateTo({url:"/pages/login/login"})},u=async()=>{if(!a.value){e.index.showToast({title:"请先登录",icon:"none"});return}const t=await e.index.chooseImage({count:1,sizeType:["compressed"],sourceType:["album","camera"]});t.tempFilePaths.length>0&&l(t.tempFilePaths[0])},l=async t=>{const r=await e.index.uploadFile({url:i.User_Avatar,filePath:t,name:"file",header:{Authorization:`Bearer ${e.index.getStorageSync("token")}`}});if(r.statusCode===200){const o=JSON.parse(r.data);o.success?(n.value.avatarUrl=o.avatarUrl,e.index.showToast({title:"头像更新成功",icon:"success"})):e.index.showToast({title:"头像更新失败",icon:"none"})}else e.index.showToast({title:"网络请求失败，请检查您的网络连接",icon:"none"})},d=async()=>{e.index.removeStorageSync("token"),e.index.removeStorageSync("userInfo"),a.value=!1,n.value={},e.index.showToast({title:"退出成功",duration:2e3})},s=t=>{if(!a.value){e.index.showToast({title:"请先登录",icon:"none"});return}e.index.navigateTo({url:`/pages/${t}/${t}`})};return e.onMounted(async()=>{const t=await e.index.request({url:i.Get_Userinfo,method:"GET",header:{Authorization:`Bearer ${e.index.getStorageSync("token")}`}});e.index.__f__("log","at pages/user/user.vue:143",t),t.statusCode==200&&(a.value=!0,n.value=t.data.userInfo)}),(t,r)=>e.e({a:e.unref(n).avatarUrl,b:e.o(u),c:e.t(e.unref(n).nickname),d:!e.unref(a)},e.unref(a)?{f:e.o(d)}:{e:e.o(c)},{g:e.o(o=>s("history")),h:e.o(o=>s("collect")),i:e.o(o=>s("profile"))})}},v=e._export_sfc(f,[["__scopeId","data-v-0f7520f0"]]);wx.createPage(v);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/user.js.map
