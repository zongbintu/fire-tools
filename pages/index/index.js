// 首页逻辑
import * as echarts from '../../components/ec-canvas/echarts';
let chart = null;
function initChart(canvas, width, height, dpr){
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);

  var option = {
    xAxis: {
      data: ['202501', '202502', '202503', '202504', '202505']
    },
    yAxis: {},
    series: [
      {
        data: [10, 22, 28, 23, 19],
        type: 'line',
        smooth: true
      },
      {
        data: [2, 13, 40, 99],
        type: 'line',
        smooth: true
      }
    ]
  };
  chart.setOption(option);
  console.log('-initChart:'+chart);
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
    console.log('--onShow');
    this.loadTotalData();
  },
  loadTotalData: function() {
    let expenses = wx.getStorageSync('expenses') || [];
    console.log(JSON.stringify(expenses));
  // 取出数据中的日期 ，支出 收益
  let xData = [];
  let expenseData = [];
  let profitData = [];
  expenses.forEach(item=>{
    xData.push(item.date);
    expenseData.push(item.amount);
    profitData.push(item.profit);
  });
  var option = {
    xAxis: {
      data: xData
    },
    yAxis: {},
    series: [
      {
        data: expenseData,
        type: 'line',
        smooth: true
      },
      {
        data: profitData,
        type: 'line',
        smooth: true
      }
    ]
  };
  console.log('---'+chart);
  if(chart){
    chart.setOption(option);
  }
  },
  navigateToExpense: function() {
    // 跳转到支出记录页面
    wx.navigateTo({
      url: '/pages/expense/expense'
    });
  }
});
