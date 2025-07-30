// 首页逻辑
import * as echarts from '../../components/ec-canvas/echarts';
let chart = null;
let chatData ={
  xData: [],
  yProfitData:[],
  yExpenseData:[]
}
var chatOption={
  tooltip: {
    show: true,
    trigger: 'axis'
  },
  xAxis: {
    data: chatData.xData
  },
  yAxis: {
    name: '金额（元）',
    scale: true,
    axisLabel: {
      margin: 2,
      formatter: function (value, index) {
          if (value >= 10000 && value < 10000000) {
              value = value / 10000 + "万";
          } else if (value >= 10000000) {
              value = value / 10000000 + "千万";
          }
          return value;
      }
  },
  },
  series: [
    {
      data: chatData.yExpenseData,
      type: 'line',
      smooth: true,
      name: '家庭支出'
    },
    {
      data: chatData.yProfitData,
      type: 'line',
      smooth: true,
      name: '投资收益'
    }
  ]
}
function initChart(canvas, width, height, dpr){
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  chart.setOption(chatOption);
  return chart;
}
Page({
  data: {
    totalExpense: 0,
    totalInvestment: 0,
    ec:{
      onInit: initChart
    }
  },
  onLoad: function() {
    // 页面加载时，从本地存储获取总支出和总投资收益
    this.loadTotalData();
  },
  onShow: function() {
    // 每次显示页面时，重新加载数据
    if(chart)
    this.loadTotalData();
  },

  onShareAppMessage: function () {
    return {
      title: '邀请您使用FIRE TOOL小程序',
      path: '/pages/index/index',
      imageUrl: ''
    }
  },
  loadTotalData: function() {
    let expenses = wx.getStorageSync('expenses') || [];
  // 取出数据中的日期 ，支出 收益)
  chatData.xData = [];
  chatData.yExpenseData = [];
  chatData.yProfitData = [];

  expenses.forEach(item=>{
    chatData.xData.push(item.date);
    chatData.yExpenseData.push(item.amount);
    chatData.yProfitData.push(item.profit);
  });
  chatOption.series[0].data = chatData.yExpenseData;
  chatOption.series[1].data = chatData.yProfitData;
  chatOption.xAxis.data = chatData.xData;
  if(chart)
  chart.setOption(chatOption);
  },
  navigateToExpense: function() {
    // 跳转到支出记录页面
    wx.navigateTo({
      url: '/pages/expense/expense'
    });
  }
});
