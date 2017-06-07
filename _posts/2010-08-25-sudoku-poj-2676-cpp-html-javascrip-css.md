---
layout: post
title: "我和数独——从POJ2676说起"
date: 2010-08-25 09:04:44 +0000
---

## 初识数独

认识数独纯属偶然，03年，也就是我刚刚读初中的时候，我在《广州日报》上看到了数独的游戏，于是便研究起来，但是，很不幸，由于我不懂窍门，除了个别比较简单的之外，我几乎没有任何耐性去求解一些数独。

后来，数独渐渐流行起来，越来越多的人开始认识数独，我也在使用电脑的过程中，发现了一些数独的游戏，于是，我也开始有意识的去了解数独的来由，但是由于我是个没什么耐性的人，所以，我也较少花大量的时间去解数独的难题。

## 再识数独

不久前，ACM学习深度优先搜索的时候，遇到了一个求解数独的问题，我又重新开始研究数独，用机器解题。一开始，由于并不熟悉深搜的原理，我连一点思路也没有——怎么能搜索呢？后来，学长指导下，完成了数独的深搜程序。

## C++的数独解题程序

这里的是POJ2676上面的题目，这个是我的C++代码。通过这个程序，可以很好的学习到深度搜索的精要，这里用典型的递归对数独的每一个单元格进行搜索，通过3个，27组布尔数组判断填表是否正确。

```c++
#include <stdlib.h>
#include <string.h>
bool bx[10][10],by[10][10],bxy[4][4][10],fin;
int sd[10][10];

void slove(int x,int y){
	int i,xx,yy;
	if(sd[x][y]==0){
		for(i=1;i<=9;i++){
			if(bx[x][i]&&by[y][i]&&bxy[(x+2)/3][(y+2)/3][i]){
				bx[x][i]=false;
				by[y][i]=false;
				bxy[(x+2)/3][(y+2)/3][i]=false;
				sd[x][y]=i;
				if(x==9){
					if(y==9){
						fin=true;
						return;
					}else{
						xx=1;
						yy=y+1;
					}
				}else{
					xx=x+1;
					yy=y;
				}
				slove(xx,yy);
				if(fin){
					return;
				}
				sd[x][y]=0;
				bx[x][i]=true;
				by[y][i]=true;
				bxy[(x+2)/3][(y+2)/3][i]=true;
			}
		}
	}else{
		if(x==9){
			if(y==9){
				fin=true;
				return;
			}else{
				xx=1;
				yy=y+1;
			}
		}else{
			xx=x+1;
			yy=y;
		}
		slove(xx,yy);
	}
}

int main(){
	int n,i,j;
	char c;
	scanf("%d",&n);
	while(n--){
		memset(bxy,1,sizeof(bxy));
		memset(by,1,sizeof(by));
		memset(bx,1,sizeof(bx));
		fin=false;
		for(i=1;i<=9;i++){
			for(j=1;j<=9;j++){
				c='n';
				while(c=='n')
					scanf("%c",&c);
				sd[j][i]=c-'0';
				if(sd[j][i]>0){
					bx[j][sd[j][i]]=false;
					by[i][sd[j][i]]=false;
					bxy[(j+2)/3][(i+2)/3][sd[j][i]]=false;
				}
			}
		}
		slove(1,1);
		for(i=1;i<=9;i++){
			for(j=1;j<=9;j++){
				printf("%d",sd[j][i]);
			}
			printf("n");
		}
	}
	return 0;
}
```

## C++改写为JavaScript

怎么说，交完题，并且AC之后，我不甘于这样一个有点实用性的程序，就这样完了。但我对于可视化编程并不熟悉，网页设计还行，所以我将它改造为Javascript，并且嵌套到网页中，也就是这个网站机器解题的部分。

下面，就是JavaScript的代码，由我的C++改写而成的。

C++改写为JavaScript怎么说，交完题，并且AC之后，我不甘于这样一个有点实用性的程序，就这样完了。但我对于可视化编程并不熟悉，网页设计还行，所以我将它改造为Javascript，并且嵌套到网页中，也就是这个网站机器解题的部分。

下面，就是JavaScript的代码，由我的C++改写而成的。

```javascript
/*
日期：2010-8-25
*/
function $(id){
	return document.getElementById(id);
}

function showerr(msg){
	setTimeout("$('msg').innerHTML='"+$("msg").innerHTML+"';",3000);
	$("msg").innerHTML=""+msg+"";
}

/*bx,by,bxy分别是列，行，子九宫格的数字重复状态保存数组*/
var i,j,bx=new Array(10),by=new Array(10),bxy=new Array(4),sd=new Array(10);

/*JavaScript多维数组定义，麻烦啊*/
for(i=0;i<4;i++){
	bxy[i]=new Array(4);
	for(j=0;j<4;j++){
		bxy[i][j]=new Array(10);
	}
}
for(j=0;j<10;j++){
	bx[j]=new Array(10);
	by[j]=new Array(10);
	sd[j]=new Array(10);
}

/*深搜解题*/
function slove(x,y){
	var i,xx,yy,bxyx,bxyy;
	if(sd[x][y]==0){
		for(i=1;i<=9;i++){/*逐个试验能不能填进去*/
			bxyx=parseInt((x+2)/3);/*数组下表，需要取整*/
			bxyy=parseInt((y+2)/3);
			if(bx[x][i]&&by[y][i]&&bxy[bxyx][bxyy][i]){
				/*标记填数字后的状态*/
				bx[x][i]=false;
				by[y][i]=false;
				bxy[bxyx][bxyy][i]=false;
				sd[x][y]=i;
				/*检查填表情况，决定下一步怎么做*/
				if(x==9){
					if(y==9){
						/*全部填满了这里可以输出结果，
						如果需要更多结果，输出后，不要返回为真即可，如果无解，
						不会执行到这的，同时，由于状态还原，会以原来的输入作为输出*/
						return true;
					}else{
						/*虽然一行填满了，但是还有一些行没填，移到后面的行*/
						xx=1;
						yy=y+1;
					}
				}else{
					/*这一行也没填完，继续这一行的下一个格*/
					xx=x+1;
					yy=y;
				}
				/*继续搜索*/
				if(slove(xx,yy)){/*递归结束标志*/
					return true;
				}
				/*状态还原*/
				sd[x][y]=0;
				bx[x][i]=true;
				by[y][i]=true;
				bxy[bxyx][bxyy][i]=true;
			}
		}
	}else{
		if(x==9){/*注释同上*/
			if(y==9){
				return true;
			}else{
				xx=1;
				yy=y+1;
			}
		}else{
			xx=x+1;
			yy=y;
		}
		if(slove(xx,yy))
			return true;
	}
	return false;
}

/*读取数据，调用函数解题*/
$("slove").onclick=function(){
	var i,j,k,tmp,bxyx,bxyy;
	/*重复状态初始化*/
	for(i=0;i<4;i++){
		for(j=0;j<4;j++){
			for(k=0;k<10;k++){
				bxy[i][j][k]=true;
			}
		}
	}
	for(i=0;i<10;i++){
		for(j=0;j<10;j++){
			by[i][j]=true;
			bx[i][j]=true;
			sd[i][j]=0;
		}
	}
	for(i=1;i<=9;i++){
		for(j=1;j<=9;j++){
			/*读取数据*/
			$("cell"+i+j).innerHTML
			=$("cell"+i+j).innerHTML.replace(/<.+?>|[^0-9]+/,"")
			/*删除html标记以及非数字，这个是正则表达式*/
			tmp=$("cell"+i+j).innerHTML;
			if(tmp==""||tmp=="0"){/*不处理的，认为就是空的标记*/
				continue;
			}
			tmp=parseInt(tmp)
			if(isNaN(tmp)){/*不是数字*/
				showerr("第"+j+"行，第"+i+"列 非法字符！");
				$("cell"+i+j).focus();
				return;
			}
			if(tmp<=9&&tmp>0){/*合法输入*/
				bxyx=parseInt((i+2)/3);
				bxyy=parseInt((j+2)/3);
				if(bx[i][tmp]&&by[j][tmp]&&bxy[bxyx][bxyy][tmp]){/*没有找到冲突*/
					/*所在冲突区域不能填这个数了*/
					bx[i][tmp]=false;
					by[j][tmp]=false;
					bxy[bxyx][bxyy][tmp]=false;
					sd[i][j]=tmp;/*储存数独表*/
				}else{/*冲突*/
					showerr("第"+j+"行，第"+i+"列 值有问题，不合法的输入，重复了！");
					$("cell"+i+j).focus();
					return;
				}
			}else if(tmp!=0){/*数字范围有问题*/
				showerr("第"+j+"行，第"+i+"列 非法数字！");
				$("cell"+i+j).focus();
				return;
			}
		}
	}
	if(slove(1,1)){/*调用解题函数*/
		/*输出*/
		for(i=1;i<=9;i++){
			for(j=1;j<=9;j++){
				$("cell"+i+j).innerHTML=sd[i][j];
			}
		}
	}else{
		showerr("真遗憾，这个数独没有解～");
	}
}

/*重置表格*/
$("reset").onclick=function(){
	for(i=1;i<=9;i++){
		for(j=1;j<=9;j++){
			$("cell"+i+j).innerHTML="";
		}
	}
}

$("sudoku").onkeypress=function(ev){
	var code,bshift;
	if(ev==null){
	/*只有firefox才有参数传进来，
	当然，实践证明google chrome既有参数传入，
	也有event对象*/
		bshift=event.shiftKey;
		code=event.keyCode
	}else{
		code=ev.which;/*Firefox没有keyCode这个属性，取而代之的是which*/
		bshift=ev.shiftKey;
	}
	return(!bshift&&code>47&&code<58);
}
```

改写为Javascript，虽然说有超过50%的代码都不需要写，但是由于Javascript变量的特殊性，很多地方需要特殊处理一下，特别是数组，字符串。不过，还算轻松的。

## DIV+CSS布局

故事还没有完呢~写完了Javascript，但是还需要有容器将结果装起来啊，所以，我还需要写一个网页，代码嘛，如下：

```html
<div id="sudoku">
	<div id="box11">
		<div contentEditable="true" id="cell11"></div>
		<div contentEditable="true" id="cell21"></div>
		<div contentEditable="true" id="cell31"></div>
		<div contentEditable="true" id="cell12"></div>
		<div contentEditable="true" id="cell22"></div>
		<div contentEditable="true" id="cell32"></div>
		<div contentEditable="true" id="cell13"></div>
		<div contentEditable="true" id="cell23"></div>
		<div contentEditable="true" id="cell33"></div>
	</div>
	<div id="box12">
		<div contentEditable="true" id="cell41"></div>
		<div contentEditable="true" id="cell51"></div>
		<div contentEditable="true" id="cell61"></div>
		<div contentEditable="true" id="cell42"></div>
		<div contentEditable="true" id="cell52"></div>
		<div contentEditable="true" id="cell62"></div>
		<div contentEditable="true" id="cell43"></div>
		<div contentEditable="true" id="cell53"></div>
		<div contentEditable="true" id="cell63"></div>
	</div>
	<div id="box13">
		<div contentEditable="true" id="cell71"></div>
		<div contentEditable="true" id="cell81"></div>
		<div contentEditable="true" id="cell91"></div>
		<div contentEditable="true" id="cell72"></div>
		<div contentEditable="true" id="cell82"></div>
		<div contentEditable="true" id="cell92"></div>
		<div contentEditable="true" id="cell73"></div>
		<div contentEditable="true" id="cell83"></div>
		<div contentEditable="true" id="cell93"></div>
	</div>
	<div id="box21">
		<div contentEditable="true" id="cell14"></div>
		<div contentEditable="true" id="cell24"></div>
		<div contentEditable="true" id="cell34"></div>
		<div contentEditable="true" id="cell15"></div>
		<div contentEditable="true" id="cell25"></div>
		<div contentEditable="true" id="cell35"></div>
		<div contentEditable="true" id="cell16"></div>
		<div contentEditable="true" id="cell26"></div>
		<div contentEditable="true" id="cell36"></div>
	</div>
	<div id="box22">
		<div contentEditable="true" id="cell44"></div>
		<div contentEditable="true" id="cell54"></div>
		<div contentEditable="true" id="cell64"></div>
		<div contentEditable="true" id="cell45"></div>
		<div contentEditable="true" id="cell55"></div>
		<div contentEditable="true" id="cell65"></div>
		<div contentEditable="true" id="cell46"></div>
		<div contentEditable="true" id="cell56"></div>
		<div contentEditable="true" id="cell66"></div>
	</div>
	<div id="box23">
		<div contentEditable="true" id="cell74"></div>
		<div contentEditable="true" id="cell84"></div>
		<div contentEditable="true" id="cell94"></div>
		<div contentEditable="true" id="cell75"></div>
		<div contentEditable="true" id="cell85"></div>
		<div contentEditable="true" id="cell95"></div>
		<div contentEditable="true" id="cell76"></div>
		<div contentEditable="true" id="cell86"></div>
		<div contentEditable="true" id="cell96"></div>
	</div>
	<div id="box31">
		<div contentEditable="true" id="cell17"></div>
		<div contentEditable="true" id="cell27"></div>
		<div contentEditable="true" id="cell37"></div>
		<div contentEditable="true" id="cell18"></div>
		<div contentEditable="true" id="cell28"></div>
		<div contentEditable="true" id="cell38"></div>
		<div contentEditable="true" id="cell19"></div>
		<div contentEditable="true" id="cell29"></div>
		<div contentEditable="true" id="cell39"></div>
	</div>
	<div id="box32">
		<div contentEditable="true" id="cell47"></div>
		<div contentEditable="true" id="cell57"></div>
		<div contentEditable="true" id="cell67"></div>
		<div contentEditable="true" id="cell48"></div>
		<div contentEditable="true" id="cell58"></div>
		<div contentEditable="true" id="cell68"></div>
		<div contentEditable="true" id="cell49"></div>
		<div contentEditable="true" id="cell59"></div>
		<div contentEditable="true" id="cell69"></div>
	</div>
	<div id="box33">
		<div contentEditable="true" id="cell77"></div>
		<div contentEditable="true" id="cell87"></div>
		<div contentEditable="true" id="cell97"></div>
		<div contentEditable="true" id="cell78"></div>
		<div contentEditable="true" id="cell88"></div>
		<div contentEditable="true" id="cell98"></div>
		<div contentEditable="true" id="cell79"></div>
		<div contentEditable="true" id="cell89"></div>
		<div contentEditable="true" id="cell99"></div>
	</div>
</div>
```



CSS样式：

```css
#sudoku {
	padding:2px;
	height: 516px;
	width: 516px;
	margin-right: auto;
	margin-left: auto;
	border: 3px solid #555;
	margin-bottom:15px;
}
#sudoku div{
	position:static;
	padding:1px;
	margin: 2px;
	float: left;
	height: 162px;
	width: 162px;
	border: 2px solid #1F4062;
}
#sudoku div div{
	position:static;
	padding:0px;
	margin: 1px;
	border: 1px solid #aaa;
	height: 50px;
	width: 50px;
	float: left;
	line-height: 50px;
	text-align: center;
	overflow:hidden;
}
```

好了，就这么多，如果你喜欢，自己组装一下，就可以玩数独的游戏啦~
