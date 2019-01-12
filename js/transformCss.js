(function(w){
	
	w.transformCss = function (node,name,value){
			//创建对象，保存名值对			
			if(!node.aaa){				
				node.aaa = {};
//				console.log(node.aaa)
			};
			
			if(arguments.length > 2){
				//写
				
				//保存最终结果
				var result = '';
				//把名值对放在对象中
				node.aaa[name] = value;//{translateX: 200, scale: 0.5}
//				console.log(node.aaa)
				
				for(var i in node.aaa){
					
					switch (i){
						case 'translateX':
						case 'translateY':
						case 'translate':
						case 'translateZ':
							result +=  i +'('+ node.aaa[i] +'px) '
							break;
						case 'scaleX':
						case 'scaleY':
						case 'scale':
							result +=  i +'('+ node.aaa[i] +') '
							break; 
						case 'rotate':
						case 'skewX':
						case 'skewY':
						case 'skew':
							result +=  i +'('+ node.aaa[i] +'deg) '
							break;
					}
					
				};
				
				node.style.transform = result;
				
				
			}else{
				//读
				
				//如果没有写的操作
				if(typeof node.aaa[name] == 'undefined'){
					//初始值
					if(name == 'scale' || name == 'scaleX' || name=='scaleY'){
						value = 1;
					}else{
						value = 0;
					}
					
				}else{
					//有写的操作
					
					value = node.aaa[name];
				}
				
				return value;
			}
			
			
		};

	
	
})(window);

		