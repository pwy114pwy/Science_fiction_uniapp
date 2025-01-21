// src/api.js

export const BASE_URL = 'http://127.0.0.1:3000/api'; // 基础 API 地址
// export const BASE_URL = 'http://43c497bb.r11.vip.cpolar.cn/api'; // 基础 API 地址


//登录的api
export const User_Login = `${BASE_URL}/user/login`;

//注册的api
export const User_Register = `${BASE_URL}/user/register`;

//调用更新用户头像api
export const User_Avatar = `${BASE_URL}/user/avatar`;

//获取个人信息的api
export const Get_Userinfo = `${BASE_URL}/user/info`;

//更改个人信息的api
export const Change_Userinfo = `${BASE_URL}/user/change_userinfo`;

//更改密码的api
export const Change_Password = `${BASE_URL}/user/change_password`;

//获取轮播图的api
export const Get_Swiper = `${BASE_URL}/Swiper`;

//获取所有图书的api
export const Get_All_Books = `${BASE_URL}/getAllBooks`;

//获取书籍详情的api
export const Get_DetailBook = `${BASE_URL}/GetDetailBook`;

//搜索书籍的api
export const Search_Book = `${BASE_URL}/SearchBook`;


//获取角色详情的api
export const Get_Character_Detail = `${BASE_URL}/getCharacterDetail`;

//获取相关角色的api
export const Get_Related_Characters = `${BASE_URL}/getRelatedCharacters`;

// 获取用户收藏的书籍
export const GET_USER_COLLECT_BOOK = `${BASE_URL}/getUserCollectBook`;

// 收藏书籍
export const Collect_Book = `${BASE_URL}/CollectBook`;

// 取消收藏书籍
export const UNCOLLECT_BOOK = `${BASE_URL}/UnCollectBook`;

//获取浏览历史  
export const Get_All_BrowseHistory = `${BASE_URL}/getAllBrowseHistory`;

//添加浏览历史的api 
export const Insert_BrowseHistory = `${BASE_URL}/InsertBrowseHistory`;

//移除浏览历史的api 
export const Delete_BrowseHistory = `${BASE_URL}/deleteBrowseHistory`;

//清除浏览历史的api 
export const Clear_AllBrowseHistory = `${BASE_URL}/clearAllBrowseHistory`;

//添加评论的api 
export const AddBook_Comment = `${BASE_URL}/AddBookComment`;

//删除评论的api 
export const DeleteBook_Comment = `${BASE_URL}/DeleteBookComment`;

//获取所有图鉴的api
export const Get_AllIllustrated = `${BASE_URL}/getAllIllustrated`;

//获取人物和关系详情的api
export const Get_CharactersAndRelationships = `${BASE_URL}/getCharactersAndRelationships`;

//获取事件的api
export const Get_Event = `${BASE_URL}/getEvent`;

//获取世界观的api
export const Get_Worldview = `${BASE_URL}/getWorldview`;

//获取科技的api
export const Get_Science = `${BASE_URL}/getScience`;

//获取讨论区的api
export const Get_Discussion = `${BASE_URL}/getDiscussion`;

//添加讨论的api
export const Add_Discussion = `${BASE_URL}/addDiscussion`;

//删除讨论的api
export const Delete_Discussion = `${BASE_URL}/deleteDiscussion`;