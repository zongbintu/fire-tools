// 支出记录页面逻辑
Page({
  data: {
    amount: '',
    profit: '',
    date: ''
  },
  onLoad: function() {
    // 设置默认日期为今天
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    this.setData({ date: formattedDate });
  },
  bindAmountInput: function(e) {
    this.setData({ amount: e.detail.value });
  },
  bindProfitInput: function(e) {
    this.setData({ profit: e.detail.value });
  },
  bindDateChange: function(e) {
    this.setData({ date: e.detail.value });
  },
  saveExpense: function() {
    const { amount,profit, date } = this.data;
    if (!amount && !profit) {
      wx.showToast({
        title: '请输入收益或支出',
        icon: 'none'
      })
      return
    }
    // 日期相同时，数据去重。按日期从小到大排序；
    // 获取现有的支出记录
    const record = { amount,profit, date }
    let records = wx.getStorageSync('expenses') || [];
    // 检查是否有相同日期的记录
    const existingIndex = records.findIndex(r => r.date === date)
    if (existingIndex !== -1) {
      // 如果有相同日期的记录，询问是否覆盖
      wx.showModal({
        title: '覆盖记录',
        content: '该日期已有记录，是否覆盖？',
        success: (res) => {
          if (res.confirm) {
            records[existingIndex] = record
            this.saveRecords(records)
          }
        }
      })
    } else {
      // 如果没有相同日期的记录，直接添加
      records.push(record)
      // 按日期排序
      records.sort((a, b) => new Date(a.date) - new Date(b.date))
      this.saveRecords(records)
    }
  },
  // 保存记录到本地存储
  saveRecords: function (records) {
    wx.setStorageSync('expenses', records)
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    })
    // 清空输入框
    this.setData({
      amount: '',
      profit: '',
      date: ''
    });
    // 返回首页
    wx.navigateBack({delta:1});
  }
});
