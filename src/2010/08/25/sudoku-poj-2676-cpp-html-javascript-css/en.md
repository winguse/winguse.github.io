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

## Interactive Sudoku Solver (Observable)

After submitting the solution and getting AC, I wasn't satisfied with letting a somewhat practical program end there. I wasn't familiar with visual programming, but I knew a bit about web design, so I transformed it into JavaScript and embedded it into a web page—which is the machine-solving part on this website.

Rewriting it in JavaScript meant that, although more than 50% of the code no longer needed to be written, many places still required special handling because of the peculiarities of JavaScript variables, especially arrays and strings. Still, it was fairly easy. With Observable's interactive capabilities, we can run it directly on the webpage:

```js
const container = document.createElement("div");
container.innerHTML = `
<div id="msg" style="color: red; height: 1.5em; margin-bottom: 10px;"></div>
<div id="sudoku"></div>
<div style="clear: both; margin-top: 20px;">
  <button id="slove">Solve</button>
  <button id="reset">Reset</button>
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
        showerr("Row " + j + " Col " + i + " invalid!");
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
          showerr("Row " + j + " Col " + i + " duplicated!");
          cell.focus();
          return;
        }
      } else if (tmp != 0) {
        showerr("Row " + j + " Col " + i + " out of range!");
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
    showerr("No solution!");
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
