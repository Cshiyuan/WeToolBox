const { formatTimeByMilliSecond } = require('./util');

var wxTimer = function (initObj) {

	initObj = initObj || {};
	this.endTime = initObj.endTime;  //结束时间

	this.interval = initObj.interval || 0;				//间隔时间
	this.complete = initObj.complete;					//结束任务
	this.intervalFn = initObj.intervalFn;				//间隔任务
	this.name = initObj.name;							//当前计时器在计时器数组对象中的名字

	this.intervarID;									//计时ID
}

wxTimer.prototype = {
	//开始
	start: function (self) {

		let countDownSeconds;
		if (this.endTime) {

			let countDown = this.endTime.getTime() - Date.now();
			if (countDown <= 0) {//距离结束时间小于0，说明已经开始，返回空串 
				if (this.complete) {
					this.complete();
				}
				this.stop();
				return;
			}
			countDownSeconds = Math.round(countDown / 1000)  //计算出倒数秒数
		}

		this.countDownSeconds = countDownSeconds
		var that = this;
		//开始倒计时
		var count = 0;//这个count在这里应该是表示s数，js中获得时间是ms，所以下面*1000都换成ms

		function begin() {

			count++;
			var wxTimerSecond = that.countDownSeconds;
			that.countDownSeconds--;
			var tmpTimeStr = formatTimeByMilliSecond(wxTimerSecond * 1000);
			var wxTimerList = self.data.wxTimerList;

			//更新计时器数组
			wxTimerList[that.name] = {
				wxTimer: tmpTimeStr,
				wxTimerSecond: wxTimerSecond,
			}

			self.setData({
				wxTimer: tmpTimeStr,
				wxTimerSecond: wxTimerSecond,
				wxTimerList: wxTimerList
			});

			//时间间隔执行函数
			if (0 == (count - 1) % that.interval && that.intervalFn) {
				that.intervalFn();
			}
			//结束执行函数
			if (wxTimerSecond <= 0) {
				if (that.complete) {
					that.complete();
				}
				that.stop();
			}
		}
		begin();
		this.intervarID = setInterval(begin, 1000);
	},

	//结束
	stop: function () {
		clearInterval(this.intervarID);
	},

	//校准
	calibration: function () {

		if (this.endTime) {
			let countDown = this.endTime.getTime() - Date.now();
			if (countDown <= 0) {//距离结束时间小于0，说明已经开始，返回空串 
				if (this.complete) {
					this.complete();
				}
				this.stop();
				return;
			}
			let countDownSeconds = Math.round(countDown / 1000)  //计算出倒数秒数
			this.countDownSeconds = countDownSeconds;
		}
	}
}

module.exports = wxTimer;
