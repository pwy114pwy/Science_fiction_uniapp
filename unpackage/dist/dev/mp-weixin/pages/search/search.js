"use strict";const e=require("../../common/vendor.js"),_=require("../../api.js"),f={__name:"search",setup(i){let t=e.ref(""),c=e.ref(""),o=e.ref([]);async function u(){try{const r=await e.index.request({url:_.Search_Book,method:"POST",data:{keyword:t.value,tag:c.value}});o.value=r.data}catch(r){e.index.__f__("error","at pages/search/search.vue:48","Error fetching search results:",r)}}let n=()=>{e.index.navigateBack()},d=r=>{e.index.setStorageSync("currentItemId",r),e.index.navigateTo({url:`/pages/detail/detail?id=${JSON.stringify(r)}`})};return e.onLoad(r=>{r.keyword&&(t.value=decodeURIComponent(r.keyword)),r.tag&&(c.value=r.tag),u()}),(r,g)=>({a:e.o((...a)=>e.unref(n)&&e.unref(n)(...a)),b:e.t(e.unref(t)||e.unref(c)),c:e.f(e.unref(o),(a,s,h)=>({a:a.Img_Url,b:e.t(a.Book_Name),c:e.t(a.Author),d:s,e:e.o(v=>e.unref(d)(a.Book_ID),s)}))})}},l=e._export_sfc(f,[["__scopeId","data-v-c10c040c"]]);wx.createPage(l);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
