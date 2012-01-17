function makeflip(Query,width,height,htmlList){
	var zBaseIndex=2;
	var zFront=zBaseIndex+1;
	var zBack=zBaseIndex-1;
	var zMiddle=zBaseIndex;
	var zMaskTop=zBaseIndex+100;
	var cur=0;
	var main,prev,next,pos,mask;
	var isFlippingBottomLeaf=true;
	var  FlipIndex=0;
	var isToCallTouchStart=true;
	function init(node){
			//console.log('init');
			$(node).css({'width':width,'height':height});
			if(main===undefined){
				$(node).html('<div class="prev"><div class="content"></div></div>'+
						 '<div class="main"><div class="content"></div></div>'+
						 '<div class="next"><div class="content"></div></div>');
				$('body').append('<div id="mask"></div>');
					main=$(node).children('.main');
					prev=$(node).children('.prev');
					next=$(node).children('.next');
					mask=$('body').children('#mask');	
					main.css({'width':width,'height':height});

					prev.css({'position':'absolute','width':width,'height':height/2});
					next.css({'position':'absolute','width':width,'height':height/2});
					mask.css({'position':'absolute','width':width,'height':height});
					pos=main.position();
					prev.css({'top':pos.top,'left':pos.left});
					next.css({'top':pos.top+height/2,'left':pos.left});
					mask.css({'top':pos.top,'left':pos.left});
					main.css({'position':'absolute','top':pos.top,'left':pos.left});
					
					prev.css({'overflow':'hidden'});
					main.css({'overflow':'hidden'});
					next.css({'overflow':'hidden'});
					mask.css({'z-index':zMaskTop});
					prev.css({'z-index':zFront});
					main.css({'z-index':zMiddle});
					next.css({'z-index':zBack});
					mask.css({'z-index':zMaskTop});	
			}
			
			
			FlipIndex=cur;
			if(!isFlippingBottomLeaf){
				FlipIndex=FlipIndex-1;
			}
			main.children('.content').html(htmlList[FlipIndex]);
			prev.children('.content').html(htmlList[FlipIndex]);
			next.children('.content').html(htmlList[FlipIndex+1]);
			
			main.children('.content').height(height);
			
			main.children('.content').css({'position':'static'});
			next.children('.content').css({'position':'relative','top':-1*height/2});

	}
	function flipit(){
			main.children('.content').height(height);
			prev.css({'z-index':zFront});
			next.css({'z-index':zBack});
			main.children('.content').html(htmlList[FlipIndex]);
	}
	function flopit(){
			prev.css({'z-index':zBack});
			next.css({'z-index':zFront});
			main.children('.content').height(height/2);
			main.children('.content').html(htmlList[FlipIndex+1]);
	}
	function orientation(deg,slow){
		deg=deg%180;
		var flipFunc=[flopit,flipit];
		var funcIndex=(deg>90 && isFlippingBottomLeaf || deg<=90 && !isFlippingBottomLeaf)?0:1;
		(flipFunc[funcIndex])();
		if(deg>90){deg=180-deg;}
		if(slow){
			main.addClass('slow');
			main.css({'-webkit-transition-duration':'0.4s'});
		}else{
			main.removeClass('slow');
			main.css({'-webkit-transition-duration':'0s'});
		}
		main.css({'-webkit-transform': 'rotateX('+deg+'deg)'});

	}
	function start(x,y){
		//console.log('start');
		midY=(pos.top+height/2);
		isFlippingBottomLeaf=(midY<y);
		init($(Query));
	}
	function drag(x,y){
		console.log('drag y='+y);
		if(isFlippingBottomLeaf){
		 		y=y*-1;
		 }
		 if(y>=0 && y<180){
		 	orientation(y);	
		 }
	}
	function stop(x,y){
		//console.log('stop');
		if(isFlippingBottomLeaf){
			y=y*-1;
		}
		var isMoreThat45Deg=(y>45);
		var isAtEnd=(cur >=htmlList.length-1) && isFlippingBottomLeaf;
		var isAtStart=((cur==0) && !isFlippingBottomLeaf);
		if(isMoreThat45Deg && !(isAtEnd || isAtStart)){
			var increment= (isFlippingBottomLeaf)?(1):(-1);
			cur=cur+increment;
			orientation(179.9,true);
		}else{
			orientation(0,true);
		}
		main.css({'-webkit-transform': ''});
		setTimeout(function(){
				isFlippingBottomLeaf=true;
				init($(Query))
				
				prev.css({'z-index':zFront});
				main.css({'z-index':zMiddle});
				next.css({'z-index':zBack});
				mask.css({'z-index':zMaskTop});		
		},1000);
	}
	function hookEvents(node){
		var startTouchX,startTouchY,moveTouchX,moveTouchY;
		if(window.ontouchstart=== undefined){
			$(mask).draggable({drag: function(event, ui) {
				 	drag(ui.position.left,ui.position.top);
				  },
				   stop: function(event, ui) { 
				   		stop(ui.position.left,ui.position.top);
				   },
				   start: function(event, ui) { 
				   	 start(event.originalEvent.clientX,event.originalEvent.clientY);	
				   },
				   helper: function(){return $("<div>")}
	  		});	
	  		return;
		}
		else{
			
			$(mask).bind('touchstart',function(event){
				if(event.originalEvent.targetTouches.length>1)return;
				//console.log('touchstart');
			    //event.preventDefault();
			    var e = event.originalEvent;
			    isToCallTouchStart=true;
			    startTouchX = e.targetTouches[0].pageX;
			    startTouchY = e.targetTouches[0].pageY;
			    //start(startTouchX,startTouchY);
			});

			$(mask).bind('touchmove', function(event){
				//console.log('touchmove');
				if(event.originalEvent.targetTouches.length>1)return;
			    event.preventDefault();
			    var e = event.originalEvent;
			    moveTouchX = e.targetTouches[0].pageX;
			    moveTouchY = e.targetTouches[0].pageY;
			    if(isToCallTouchStart){
			    	isToCallTouchStart=false;
			    	startTouchX=moveTouchX;
			    	startTouchY=moveTouchY;
			    	start(moveTouchX,moveTouchY);	
			    }
			    var mx=moveTouchX-startTouchX;
			    var my=moveTouchY-startTouchY;
			    if(my==0){
			    	my=1;
			    }
			    drag(mx,my);  
			});
			
			$(mask).bind('touchend',function(){
				//console.log('touchend');
				isToCallTouchStart=true;
			    stop(moveTouchX-startTouchX,moveTouchY-startTouchY);
			});	
			$('body').bind('touchmove', function(event){
				event.preventDefault();
			});
		}
	  	
	}
	init($(Query));
	hookEvents($(Query));
}
