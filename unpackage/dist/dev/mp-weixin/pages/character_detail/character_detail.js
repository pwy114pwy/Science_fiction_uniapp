"use strict";const e=require("../../common/vendor.js"),p=require("../../api.js");Array||e.resolveComponent("l-echart")();const C=()=>"../../uni_modules/lime-echart/components/l-echart/l-echart.js";Math||C();const w={__name:"character_detail",setup(g){const _=e.ref(null),v=e.ref(null),c=e.ref(!1),d=e.ref(null),a=e.ref(null),i=e.ref([]);let f=e.ref([]),h=e.ref([]),m=e.ref([]);e.onLoad(async l=>{const o=l.id;a.value=await x(o),i.value=[],i.value=await y(o),e.index.__f__("log","at pages/character_detail/character_detail.vue:98",i.value),a.value[0].Tag&&(f.value=a.value[0].Tag.split(","));for(const r in a.value[0])if(r.includes("Contribute")&&a.value[0][r]){let n=a.value[0][r].split("|"),u={value:n[0],name:n[1],des:n[2]};h.value.push(u)}if(a.value[0].Classic_Quotes){let r=a.value[0].Classic_Quotes.split("|");m.value=r}let t={title:{text:""},radar:{indicator:[{name:"战斗力",max:100},{name:"智力",max:100},{name:"决策",max:100},{name:"影响力",max:100},{name:"道德",max:100},{name:"意志",max:100}]},series:[{name:"能力",type:"radar",data:[{value:[80,99,95,99,99,99],name:"罗辑"}]}]},s={tooltip:{trigger:"item"},legend:{top:"5%",left:"center",padding:[0,0,0,0]},series:[{name:"主要经历",type:"pie",radius:["40%","70%"],top:"40px",avoidLabelOverlap:!1,padAngle:5,itemStyle:{borderRadius:10},label:{show:!1,position:"center"},emphasis:{label:{show:!0,fontSize:20,fontWeight:"bold"}},labelLine:{show:!1},data:[]}]};t.series[0].data=[a.value[0].Ability],s.series[0].data=h.value,setTimeout(async()=>{if(!_.value)return;const r=await _.value.init(e.echarts),n=await v.value.init(e.echarts);n.on("click",function(u){e.index.__f__("log","at pages/character_detail/character_detail.vue:223",u),d.value=u,c.value=!0}),r.setOption(t),n.setOption(s)},300)});const b=l=>{e.index.navigateTo({url:`/pages/character_detail/character_detail?id=${l.realtion_ID}`})};async function x(l){return(await e.index.request({url:p.Get_Character_Detail,method:"POST",data:{Character_ID:l}})).data}async function y(l){return(await e.index.request({url:p.Get_Related_Characters,method:"POST",data:{Character_ID:l}})).data}return e.onMounted(()=>{}),(l,o)=>e.e({a:a.value},a.value?e.e({b:a.value[0].Role_Image,c:e.t(a.value[0].Role_Name),d:e.sr(_,"f79b17b5-0",{k:"chartRef"}),e:e.t(a.value[0].Role_Introduction),f:e.f(e.unref(f),(t,s,r)=>({a:e.t(t||"暂无描述")})),g:e.sr(v,"f79b17b5-1",{k:"chartRef_1"}),h:c.value},c.value?{i:e.t(d.value.name),j:e.t(d.value.data.des),k:e.o(t=>c.value=!1)}:{},{l:e.f(e.unref(m),(t,s,r)=>({a:e.t(t),b:s})),m:i.value.length},i.value.length?{n:e.f(i.value,(t,s,r)=>({a:t.realtion_Image,b:e.t(t.realtion_Name),c:e.t(t.relation_Type||"暂无描述"),d:t.id,e:e.o(n=>b(t),t.id)}))}:{}):{})}},R=e._export_sfc(w,[["__scopeId","data-v-f79b17b5"]]);wx.createPage(R);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/character_detail/character_detail.js.map
