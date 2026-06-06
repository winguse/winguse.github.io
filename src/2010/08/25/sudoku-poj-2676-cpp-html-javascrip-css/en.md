---
title: "Me and Sudoku — Starting from POJ2676"
date: 2010-08-25 09:04:44 +0000
---

## My First Encounter with Sudoku

I got to know Sudoku purely by chance. In 2003, when I had just started middle school, I saw Sudoku puzzles in the *Guangzhou Daily* and began looking into them. Unfortunately, since I didn't know any solving techniques, aside from a few relatively simple ones, I had almost no patience for solving harder Sudoku puzzles.

Later, Sudoku gradually became popular, and more and more people got to know it. While using computers, I also came across some Sudoku games, so I started deliberately learning about where Sudoku came from. But since I'm not a very patient person, I still rarely spent a lot of time solving difficult Sudoku puzzles.

## Rediscovering Sudoku

Not long ago, while studying depth-first search in ACM, I ran into a Sudoku-solving problem, so I began looking into Sudoku again and used a computer to solve it. At first, because I wasn't familiar with the principles of DFS, I had no idea at all—how could it possibly search? Later, with guidance from a senior student, I completed a DFS program for Sudoku.

## A C++ Sudoku Solver

This is the problem from POJ2676, and this is my C++ code. Through this program, you can learn the essence of depth-first search quite well. It uses typical recursion to search every cell of the Sudoku grid, and uses 3 groups, 27 sets of boolean arrays to determine whether the board is filled correctly.

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

## Rewriting C++ in JavaScript

How should I put it? After submitting the solution and getting AC, I wasn't satisfied with letting a somewhat practical program end there. I wasn't familiar with visual programming, but I knew a bit about web design, so I transformed it into JavaScript and embedded it into a web page—which is the machine-solving part on this website.

Below is the JavaScript code, rewritten from my C++ version.

After submitting the solution and getting AC, I wasn't satisfied with letting a somewhat practical program end there. I wasn't familiar with visual programming, but I knew a bit about web design, so I transformed it into JavaScript and embedded it into a web page—which is the machine-solving part on this website.

Below is the JavaScript code, rewritten from my C++ version.

```javascript
/*
日期：2010-8-25
*/
function $(id) {
  return document.getElementById(id);
}

function showerr(msg) {
  setTimeout("$('msg').innerHTML='" + $("msg").innerHTML + "';", 3000);
  $("msg").innerHTML = "" + msg + "";
}

/*bx,by,bxy分别是列，行，子九宫格的数字重复状态保存数组*/
var i,
  j,
  bx = new Array(10),
  by = new Array(10),
  bxy = new Array(4),
  sd = new Array(10);

/*JavaScript多维数组定义，麻烦啊*/
for (i = 0; i < 4; i++) {
  bxy[i] = new Array(4);
  for (j = 0; j < 4; j++) {
    bxy[i][j] = new Array(10);
  }
}
for (j = 0; j < 10; j++) {
  bx[j] = new Array(10);
  by[j] = new Array(10);
  sd[j] = new Array(10);
}

/*深搜解题*/
function slove(x, y) {
  var i, xx, yy, bxyx, bxyy;
  if (sd[x][y] == 0) {
    for (i = 1; i <= 9; i++) {
      /*逐个试验能不能填进去*/
      bxyx = parseInt((x + 2) / 3); /*数组下表，需要取整*/
      bxyy = parseInt((y + 2) / 3);
      if (bx[x][i] && by[y][i] && bxy[bxyx][bxyy][i]) {
        /*标记填数字后的状态*/
        bx[x][i] = false;
        by[y][i] = false;
        bxy[bxyx][bxyy][i] = false;
        sd[x][y] = i;
        /*检查填表情况，决定下一步怎么做*/
        if (x == 9) {
          if (y == 9) {
            /*全部填满了这里可以输出结果，
            如果需要更多结果，输出后，不要返回为真即可，如果无解，
            不会执行到这的，同时，由于状态还原，会以原来的输入作为输出*/
            return true;
          } else {
            /*虽然一行填满了，但是还有一些行没填，移到后面的行*/
            xx = 1;
            yy = y + 1;
          }
        } else {
          /*这一行也没填完，继续这一行的下一个格*/
          xx = x + 1;
          yy = y;
        }
        /*继续搜索*/
        if (slove(xx, yy)) {
          /*递归结束标志*/
          return true;
        }
        /*状态还原*/
        sd[x][y] = 0;
        bx[x][i] = true;
        by[y][i] = true;
        bxy[bxyx][bxyy][i] = true;
      }
    }
  } else {
    if (x == 9) {
      /*注释同上*/
      if (y == 9) {
        return true;
      } else {
        xx = 1;
        yy = y + 1;
      }
    } else {
      xx = x + 1;
      yy = y;
    }
    if (slove(xx, yy)) return true;
  }
  return false;
}

/*读取数据，调用函数解题*/
$("slove").onclick = function () {
  var i, j, k, tmp, bxyx, bxyy;
  /*重复状态初始化*/
  for (i = 0; i < 4; i++) {
    for (j = 0; j < 4; j++) {
      for (k = 0; k < 10; k++) {
        bxy[i][j][k] = true;
      }
    }
  }
  for (i = 0; i < 10; i++) {
    for (j = 0; j < 10; j++) {
      by[i][j] = true;
      bx[i][j] = true;
      sd[i][j] = 0;
    }
  }
  for (i = 1; i <= 9; i++) {
    for (j = 1; j <= 9; j++) {
      /*读取数据*/
      $("cell" + i + j).innerHTML = $("cell" + i + j).innerHTML.replace(
        /<.+?>|[^0-9]+/,
        ""
      );
      /*删除html标记以及非数字，这个是正则表达式*/
      tmp = $("cell" + i + j).innerHTML;
      if (tmp == "" || tmp == "0") {
        /*不处理的，认为就是空的标记*/
        continue;
      }
      tmp = parseInt(tmp);
      if (isNaN(tmp)) {
        /*不是数字*/
        showerr("第" + j + "行，第" + i + "列 非法字符！");
        $("cell" + i + j).focus();
        return;
      }
      if (tmp <= 9 && tmp > 0) {
        /*合法输入*/
        bxyx = parseInt((i + 2) / 3);
        bxyy = parseInt((j + 2) / 3);
        if (bx[i][tmp] && by[j][tmp] && bxy[bxyx][bxyy][tmp]) {
          /*没有找到冲突*/
          /*所在冲突区域不能填这个数了*/
          bx[i][tmp] = false;
          by[j][tmp] = false;
          bxy[bxyx][bxyy][tmp] = false;
          sd[i][j] = tmp; /*储存数独表*/
        } else {
          /*冲突*/
          showerr(
            "第" + j + "行，第" + i + "列 值有问题，不合法的输入，重复了！"
          );
          $("cell" + i + j).focus();
          return;
        }
      } else if (tmp != 0) {
        /*数字范围有问题*/
        showerr("第" + j + "行，第" + i + "列 非法数字！");
        $("cell" + i + j).focus();
        return;
      }
    }
  }
  if (slove(1, 1)) {
    /*调用解题函数*/
    /*输出*/
    for (i = 1; i <= 9; i++) {
      for (j = 1; j <= 9; j++) {
        $("cell" + i + j).innerHTML = sd[i][j];
      }
    }
  } else {
    showerr("真遗憾，这个数独没有解～");
  }
};

/*重置表格*/
$("reset").onclick = function () {
  for (i = 1; i <= 9; i++) {
    for (j = 1; j <= 9; j++) {
      $("cell" + i + j).innerHTML = "";
    }
  }
};

$("sudoku").onkeypress = function (ev) {
  var code, bshift;
  if (ev == null) {
    /*只有firefox才有参数传进来，
  当然，实践证明google chrome既有参数传入，
  也有event对象*/
    bshift = event.shiftKey;
    code = event.keyCode;
  } else {
    code = ev.which; /*Firefox没有keyCode这个属性，取而代之的是which*/
    bshift = ev.shiftKey;
  }
  return !bshift && code > 47 && code < 58;
};
```

Rewriting it in JavaScript meant that, although more than 50% of the code no longer needed to be written, many places still required special handling because of the peculiarities of JavaScript variables, especially arrays and strings. Still, it was fairly easy.

## DIV + CSS Layout

The story wasn't over yet~ After finishing the JavaScript, I still needed a container to hold the result, so I also had to write a web page. The code is as follows:

```html run=false
<div id="sudoku">
  <div id="box11">
    <div contenteditable="true" id="cell11"></div>
    <div contenteditable="true" id="cell21"></div>
    <div contenteditable="true" id="cell31"></div>
    <div contenteditable="true" id="cell12"></div>
    <div contenteditable="true" id="cell22"></div>
    <div contenteditable="true" id="cell32"></div>
    <div contenteditable="true" id="cell13"></div>
    <div contenteditable="true" id="cell23"></div>
    <div contenteditable="true" id="cell33"></div>
  </div>
  <div id="box12">
    <div contenteditable="true" id="cell41"></div>
    <div contenteditable="true" id="cell51"></div>
    <div contenteditable="true" id="cell61"></div>
    <div contenteditable="true" id="cell42"></div>
    <div contenteditable="true" id="cell52"></div>
    <div contenteditable="true" id="cell62"></div>
    <div contenteditable="true" id="cell43"></div>
    <div contenteditable="true" id="cell53"></div>
    <div contenteditable="true" id="cell63"></div>
  </div>
  <div id="box13">
    <div contenteditable="true" id="cell71"></div>
    <div contenteditable="true" id="cell81"></div>
    <div contenteditable="true" id="cell91"></div>
    <div contenteditable="true" id="cell72"></div>
    <div contenteditable="true" id="cell82"></div>
    <div contenteditable="true" id="cell92"></div>
    <div contenteditable="true" id="cell73"></div>
    <div contenteditable="true" id="cell83"></div>
    <div contenteditable="true" id="cell93"></div>
  </div>
  <div id="box21">
    <div contenteditable="true" id="cell14"></div>
    <div contenteditable="true" id="cell24"></div>
    <div contenteditable="true" id="cell34"></div>
    <div contenteditable="true" id="cell15"></div>
    <div contenteditable="true" id="cell25"></div>
    <div contenteditable="true" id="cell35"></div>
    <div contenteditable="true" id="cell16"></div>
    <div contenteditable="true" id="cell26"></div>
    <div contenteditable="true" id="cell36"></div>
  </div>
  <div id="box22">
    <div contenteditable="true" id="cell44"></div>
    <div contenteditable="true" id="cell54"></div>
    <div contenteditable="true" id="cell64"></div>
    <div contenteditable="true" id="cell45"></div>
    <div contenteditable="true" id="cell55"></div>
    <div contenteditable="true" id="cell65"></div>
    <div contenteditable="true" id="cell46"></div>
    <div contenteditable="true" id="cell56"></div>
    <div contenteditable="true" id="cell66"></div>
  </div>
  <div id="box23">
    <div contenteditable="true" id="cell74"></div>
    <div contenteditable="true" id="cell84"></div>
    <div contenteditable="true" id="cell94"></div>
    <div contenteditable="true" id="cell75"></div>
    <div contenteditable="true" id="cell85"></div>
    <div contenteditable="true" id="cell95"></div>
    <div contenteditable="true" id="cell76"></div>
    <div contenteditable="true" id="cell86"></div>
    <div contenteditable="true" id="cell96"></div>
  </div>
  <div id="box31">
    <div contenteditable="true" id="cell17"></div>
    <div contenteditable="true" id="cell27"></div>
    <div contenteditable="true" id="cell37"></div>
    <div contenteditable="true" id="cell18"></div>
    <div contenteditable="true" id="cell28"></div>
    <div contenteditable="true" id="cell38"></div>
    <div contenteditable="true" id="cell19"></div>
    <div contenteditable="true" id="cell29"></div>
    <div contenteditable="true" id="cell39"></div>
  </div>
  <div id="box32">
    <div contenteditable="true" id="cell47"></div>
    <div contenteditable="true" id="cell57"></div>
    <div contenteditable="true" id="cell67"></div>
    <div contenteditable="true" id="cell48"></div>
    <div contenteditable="true" id="cell58"></div>
    <div contenteditable="true" id="cell68"></div>
    <div contenteditable="true" id="cell49"></div>
    <div contenteditable="true" id="cell59"></div>
    <div contenteditable="true" id="cell69"></div>
  </div>
  <div id="box33">
    <div contenteditable="true" id="cell77"></div>
    <div contenteditable="true" id="cell87"></div>
    <div contenteditable="true" id="cell97"></div>
    <div contenteditable="true" id="cell78"></div>
    <div contenteditable="true" id="cell88"></div>
    <div contenteditable="true" id="cell98"></div>
    <div contenteditable="true" id="cell79"></div>
    <div contenteditable="true" id="cell89"></div>
    <div contenteditable="true" id="cell99"></div>
  </div>
</div>
```

CSS styles:

```css
#sudoku {
  padding: 2px;
  height: 516px;
  width: 516px;
  margin-right: auto;
  margin-left: auto;
  border: 3px solid #555;
  margin-bottom: 15px;
}
#sudoku div {
  position: static;
  padding: 1px;
  margin: 2px;
  float: left;
  height: 162px;
  width: 162px;
  border: 2px solid #1f4062;
}
#sudoku div div {
  position: static;
  padding: 0px;
  margin: 1px;
  border: 1px solid #aaa;
  height: 50px;
  width: 50px;
  float: left;
  line-height: 50px;
  text-align: center;
  overflow: hidden;
}
```

All right, that's all. If you like it, just assemble it yourself and you can play Sudoku~
