---
title: "我和数独——从POJ2676说起"
date: 2010-08-25 09:04:44 +0000
---

## 初识数独

认识数独纯属偶然，03 年，也就是我刚刚读初中的时候，我在《广州日报》上看到了数独的游戏，于是便研究起来，但是，很不幸，由于我不懂窍门，除了个别比较简单的之外，我几乎没有任何耐性去求解一些数独。

后来，数独渐渐流行起来，越来越多的人开始认识数独，我也在使用电脑的过程中，发现了一些数独的游戏，于是，我也开始有意识的去了解数独的来由，但是由于我是个没什么耐性的人，所以，我也较少花大量的时间去解数独的难题。

## 再识数独

不久前，ACM 学习深度优先搜索的时候，遇到了一个求解数独的问题，我又重新开始研究数独，用机器解题。一开始，由于并不熟悉深搜的原理，我连一点思路也没有——怎么能搜索呢？后来，学长指导下，完成了数独的深搜程序。

## C++的数独解题程序

这里的是 POJ2676 上面的题目，这个是我的 C++代码。通过这个程序，可以很好的学习到深度搜索的精要，这里用典型的递归对数独的每一个单元格进行搜索，通过 3 个，27 组布尔数组判断填表是否正确。

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

## 可交互数独求解器（Observable）

交完题，并且 AC 之后，我不甘于这样一个有点实用性的程序就这样完了。但我对于可视化编程并不熟悉，网页设计还行，所以我将它改造为 Javascript，并且嵌套到网页中，也就是这个网站机器解题的部分。

改写为 Javascript，虽然说有超过 50%的代码都不需要写，但是由于 Javascript 变量的特殊性，很多地方需要特殊处理一下，特别是数组，字符串。不过，还算轻松的。而且结合 Observable 的交互特性，我们可以直接在网页上运行：

```js echo
const container = document.createElement("div");
container.innerHTML = `
<div id="msg" style="color: red; height: 1.5em; margin-bottom: 10px;"></div>
<div id="sudoku"></div>
<div style="clear: both; margin-top: 20px;">
  <button id="slove">解题</button>
  <button id="reset">重置</button>
</div>
`;

const sudoku = container.querySelector("#sudoku");
for (let y = 1; y <= 3; y++) {
  for (let x = 1; x <= 3; x++) {
    const box = document.createElement("div");
    box.className = "sudoku-box";
    box.id = `box${x}${y}`;
    for (let j = (y - 1) * 3 + 1; j <= y * 3; j++) {
      for (let i = (x - 1) * 3 + 1; i <= x * 3; i++) {
        const cell = document.createElement("div");
        cell.className = "sudoku-cell";
        cell.contentEditable = "true";
        cell.id = `cell${i}${j}`;
        box.appendChild(cell);
      }
    }
    sudoku.appendChild(box);
  }
}

function $(id) {
  return container.querySelector('#' + id);
}

function showerr(msg) {
  setTimeout(() => { if($('msg')) $('msg').innerHTML = $('msg').innerHTML; }, 3000);
  $("msg").innerHTML = "" + msg + "";
}

var bx = new Array(10),
  by = new Array(10),
  bxy = new Array(4),
  sd = new Array(10);

for (let i = 0; i < 4; i++) {
  bxy[i] = new Array(4);
  for (let j = 0; j < 4; j++) {
    bxy[i][j] = new Array(10);
  }
}
for (let j = 0; j < 10; j++) {
  bx[j] = new Array(10);
  by[j] = new Array(10);
  sd[j] = new Array(10);
}

function slove(x, y) {
  var i, xx, yy, bxyx, bxyy;
  if (sd[x][y] == 0) {
    for (i = 1; i <= 9; i++) {
      bxyx = parseInt((x + 2) / 3);
      bxyy = parseInt((y + 2) / 3);
      if (bx[x][i] && by[y][i] && bxy[bxyx][bxyy][i]) {
        bx[x][i] = false;
        by[y][i] = false;
        bxy[bxyx][bxyy][i] = false;
        sd[x][y] = i;
        if (x == 9) {
          if (y == 9) return true;
          else { xx = 1; yy = y + 1; }
        } else {
          xx = x + 1; yy = y;
        }
        if (slove(xx, yy)) return true;
        sd[x][y] = 0;
        bx[x][i] = true;
        by[y][i] = true;
        bxy[bxyx][bxyy][i] = true;
      }
    }
  } else {
    if (x == 9) {
      if (y == 9) return true;
      else { xx = 1; yy = y + 1; }
    } else {
      xx = x + 1; yy = y;
    }
    if (slove(xx, yy)) return true;
  }
  return false;
}

$("slove").onclick = function () {
  var i, j, k, tmp, bxyx, bxyy;
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
      let cell = $("cell" + i + j);
      cell.innerHTML = cell.innerHTML.replace(/<.+?>|[^0-9]+/g, "");
      tmp = cell.innerHTML;
      if (tmp == "" || tmp == "0") continue;
      tmp = parseInt(tmp);
      if (isNaN(tmp)) {
        showerr("第" + j + "行，第" + i + "列 非法字符！");
        cell.focus();
        return;
      }
      if (tmp <= 9 && tmp > 0) {
        bxyx = parseInt((i + 2) / 3);
        bxyy = parseInt((j + 2) / 3);
        if (bx[i][tmp] && by[j][tmp] && bxy[bxyx][bxyy][tmp]) {
          bx[i][tmp] = false;
          by[j][tmp] = false;
          bxy[bxyx][bxyy][tmp] = false;
          sd[i][j] = tmp;
        } else {
          showerr("第" + j + "行，第" + i + "列 值有问题，不合法的输入，重复了！");
          cell.focus();
          return;
        }
      } else if (tmp != 0) {
        showerr("第" + j + "行，第" + i + "列 非法数字！");
        cell.focus();
        return;
      }
    }
  }
  if (slove(1, 1)) {
    for (i = 1; i <= 9; i++) {
      for (j = 1; j <= 9; j++) {
        $("cell" + i + j).innerHTML = sd[i][j];
      }
    }
  } else {
    showerr("真遗憾，这个数独没有解～");
  }
};

$("reset").onclick = function () {
  for (let i = 1; i <= 9; i++) {
    for (let j = 1; j <= 9; j++) {
      $("cell" + i + j).innerHTML = "";
    }
  }
};

sudoku.onkeypress = function (ev) {
  let bshift = ev.shiftKey;
  let code = ev.keyCode || ev.which;
  return !bshift && code > 47 && code < 58;
};

display(container);
```

<style>
#sudoku {
  padding: 2px;
  height: 516px;
  width: 516px;
  border: 3px solid #555;
  margin-bottom: 15px;
}
.sudoku-box {
  position: static;
  padding: 1px;
  margin: 2px;
  float: left;
  height: 162px;
  width: 162px;
  border: 2px solid #1f4062;
  box-sizing: border-box;
}
.sudoku-cell {
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
  box-sizing: border-box;
}
</style>
