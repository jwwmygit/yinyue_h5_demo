(function(win){
	win.dragNav = function (conNav,callback){	
			var conList = conNav.children[0];
			transformCss(conList,'translateZ',0.01);
			
			//元素初始位置，手指初始位置
			var eleY = 0;
			var startY = 0;
			//防抖动
			var startX = 0;
			var isFirst = true;
			var isY = true;
			
			//加速效果
			//起始位置与起始时间
			var beginValue = 0;
			var beginTime = 0;
			//结束位置与结束时间
			var endValue = 0;
			var endTime = 0;
			//距离差
			var disValue = 0;
			//时间差
			var disTime = 1;
			
			//tween算法
			var Tween = {
				//正常加速  linear
				Linear: function(t,b,c,d){ return c*t/d + b; },
				//回弹
				easeOut: function(t,b,c,d,s){
	            	if (s == undefined) s = 1.70158;
	            	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	        	}
				
			};
			var timer = null;
			
			conNav.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
				//即点即停
				clearInterval(timer);
				
				//清除过渡
				conList.style.transition = 'none';
				
				
				//元素初始位置
				eleY = transformCss(conList,'translateY');
				//手指初始位置
				startY = touch.clientY;
				startX = touch.clientX;
				
				//起始位置与起始时间
				beginValue = eleY;
				beginTime = new Date().getTime();//毫秒
				
				//清除距离差
				disValue = 0;
				
				//重置
				isFirst = true;
				isY = true;
				
				//检测外部逻辑
				if(callback && typeof callback['start'] == 'function'){
					callback['start']();
				}
				
				
			});
			conNav.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				
				if(!isY){
					return;
				};
				
				//手指结束位置
				var endY = touch.clientY;
				var endX = touch.clientX;
				//手指距离差
				var disY = endY - startY;
				var disX = endX - startX;
				
				//防抖动
				if(isFirst){
					isFirst = false;
					if(Math.abs(disX) > Math.abs(disY)){
						isY = false;
						return;
					}
				}
				
				
				var translateY = disY+eleY;

				//范围限定
				if(translateY > 0){
					//比例 ： 逐渐减小
					// scale = 1 - 左边留白/屏幕宽度
					var scale = 1- translateY/document.documentElement.clientHeight;
					//translateY 逐渐增加 ，增加幅度减小  (抛物线)
					//新的translateY = 临界值 + 左边留白*scale；
					translateY = 0 + translateY * scale ;

				}else if(translateY < document.documentElement.clientHeight - conList.offsetHeight){					
					//右边留白 = translateY - 临界值   （正值）
					var over = Math.abs(translateY) - (conList.offsetHeight - document.documentElement.clientHeight)
					// scale = 1 - 右边留白/屏幕宽度
					var scale = 1 - over/document.documentElement.clientHeight;					
					//新的translateY = 临界值 + 右边留白*scale；
					translateY = document.documentElement.clientHeight - conList.offsetHeight - over*scale ;
				}
				
				//确定元素位置
				transformCss(conList,'translateY',translateY);
				
				//结束位置与结束时间
				endValue = translateY;
				endTime = new Date().getTime();  //毫秒
				//距离差
				disValue = endValue - beginValue;
				//时间差
//				disTime = endTime - beginTime;
				
				if(callback && typeof callback['move'] == 'function'){
					callback['move']();
				}
			});
			//加速效果,快速滑屏,回弹
			conNav.addEventListener('touchend',function(){
				//transition : 只能检测到元素从初始位置到结束位置的整个过程，不能检测中间步骤
				//速度  = 距离差 / 时间差
				var speed = disValue/(endTime - beginTime);				
				//目标位置  = touchmove产生的值 + 速度出来的值
				var target = transformCss(conList,'translateY') + speed * 100;
				
//				console.log(target)
				
				//回弹
				var type = 'Linear'
				if(target > 0){
					target = 0;
					type = 'easeOut'
				}else if(target < document.documentElement.clientHeight - conList.offsetHeight){
					target = document.documentElement.clientHeight - conList.offsetHeight;
					type = 'easeOut'
				};
				
				
				//即点即停
				//总时间
				var time = 1;
				move(target,time,type);
				
				
				
			});
			//即点即停
			function move(target,time,type){
				//t ： 当前次数
				var t = 0;
				//b ： 起始位置
				var b = transformCss(conList,'translateY');
//				console.log(b)
				//c ： 结束位置与起始位置距离差
				var c = target - b;
//				console.log(c)
				//d ： 总次数
				var d = time/0.01;
				
				//防止重复开启定时器
				clearInterval(timer);
				timer = setInterval(function(){				
					t++;	
					if(t > d){
						//清除定时器
						clearInterval(timer);
						if(callback && typeof callback['end'] == 'function'){
							callback['end']();
						}
						
					}else{
						//正常
						var point = Tween [type](t,b,c,d);
//						console.log(point);
						transformCss(conList,'translateY',point);
						
						if(callback && typeof callback['move'] == 'function'){
							callback['move']();
						}
						
					};
					
				},10);
				
			};
			
		};
		
})(window);
