const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatHtml = content => {
  content = content.replace(/\<img/gi, '<img class="rich-img" style="width:100% !important;height:auto !important;margin:0;display:flex;" ');
  content = content.replace(/\<td/gi, '<td  cellspacing="0" cellpadding="0" border="0" style="display:block;vertical-align:top;margin: 0px; padding: 0px; border: 0px;outline-width:0px;" ');
  content = content.replace(/width=/gi, 'sss=');
  content = content.replace(/height=/gi, 'sss=');
  content = content.replace(/ \/\>/gi, ' style="max-width:100% !important;height:auto !important;margin:0;display:block;" \/\>');
  return content;
}
const checkAuthor=()=>{
  var globalData = getApp().globalData;
  console.log('globalData',globalData)
  const { userInfo } =globalData;
    if(!userInfo.nickname) {
      wx.navigateTo({
          url: '/pages/authorization/authorization',
      })
      return false;
    }
    return true
}

module.exports = {
  formatTime: formatTime,
  formatHtml: formatHtml,
  checkAuthor:checkAuthor
}
