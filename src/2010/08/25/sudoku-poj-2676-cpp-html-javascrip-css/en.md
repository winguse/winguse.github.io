---
title: "Translated English Version"
date: 2010-08-25 09:04:44 +0000
---

## translated text

translated text，03 translated text，translated text，translated text《translated text》translated text，translated text，translated text，translated text，translated text，translated text，translated text。

translated text，translated text，translated text，translated text，translated text，translated text，translated text，translated text，translated text，translated text。

## translated text

translated text，ACM translated text，translated text，translated text，translated text。translated text，translated text，translated text——translated text？translated text，translated text，translated text。

## C++translated text

translated text POJ2676 translated text，translated text C++translated text。translated text，translated text，translated text，translated text 3 translated text，27 translated text。

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

## C++translated text JavaScript

translated text，translated text，translated text AC translated text，translated text，translated text。translated text，translated text，translated text Javascript，translated text，translated text。

translated text，translated text JavaScript translated text，translated text C++translated text。

C++translated text JavaScript translated text，translated text，translated text AC translated text，translated text，translated text。translated text，translated text，translated text Javascript，translated text，translated text。

translated text，translated text JavaScript translated text，translated text C++translated text。

```javascript
/*
translated text：2010-8-25
*/
function $(id) {
  return document.getElementById(id);
}

function showerr(msg) {
  setTimeout("$('msg').innerHTML='" + $("msg").innerHTML + "';", 3000);
  $("msg").innerHTML = "" + msg + "";
}

/*bx,by,bxytranslated text，translated text，translated text*/
var i,
  j,
  bx = new Array(10),
  by = new Array(10),
  bxy = new Array(4),
  sd = new Array(10);

/*JavaScripttranslated text，translated text*/
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

/*translated text*/
function slove(x, y) {
  var i, xx, yy, bxyx, bxyy;
  if (sd[x][y] == 0) {
    for (i = 1; i <= 9; i++) {
      /*translated text*/
      bxyx = parseInt((x + 2) / 3); /*translated text，translated text*/
      bxyy = parseInt((y + 2) / 3);
      if (bx[x][i] && by[y][i] && bxy[bxyx][bxyy][i]) {
        /*translated text*/
        bx[x][i] = false;
        by[y][i] = false;
        bxy[bxyx][bxyy][i] = false;
        sd[x][y] = i;
        /*translated text，translated text*/
        if (x == 9) {
          if (y == 9) {
            /*translated text，
            translated text，translated text，translated text，translated text，
            translated text，translated text，translated text，translated text*/
            return true;
          } else {
            /*translated text，translated text，translated text*/
            xx = 1;
            yy = y + 1;
          }
        } else {
          /*translated text，translated text*/
          xx = x + 1;
          yy = y;
        }
        /*translated text*/
        if (slove(xx, yy)) {
          /*translated text*/
          return true;
        }
        /*translated text*/
        sd[x][y] = 0;
        bx[x][i] = true;
        by[y][i] = true;
        bxy[bxyx][bxyy][i] = true;
      }
    }
  } else {
    if (x == 9) {
      /*translated text*/
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

/*translated text，translated text*/
$("slove").onclick = function () {
  var i, j, k, tmp, bxyx, bxyy;
  /*translated text*/
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
      /*translated text*/
      $("cell" + i + j).innerHTML = $("cell" + i + j).innerHTML.replace(
        /<.+?>|[^0-9]+/,
        ""
      );
      /*translated texthtmltranslated text，translated text*/
      tmp = $("cell" + i + j).innerHTML;
      if (tmp == "" || tmp == "0") {
        /*translated text，translated text*/
        continue;
      }
      tmp = parseInt(tmp);
      if (isNaN(tmp)) {
        /*translated text*/
        showerr("translated text" + j + "translated text，translated text" + i + "translated text translated text！");
        $("cell" + i + j).focus();
        return;
      }
      if (tmp <= 9 && tmp > 0) {
        /*translated text*/
        bxyx = parseInt((i + 2) / 3);
        bxyy = parseInt((j + 2) / 3);
        if (bx[i][tmp] && by[j][tmp] && bxy[bxyx][bxyy][tmp]) {
          /*translated text*/
          /*translated text*/
          bx[i][tmp] = false;
          by[j][tmp] = false;
          bxy[bxyx][bxyy][tmp] = false;
          sd[i][j] = tmp; /*translated text*/
        } else {
          /*translated text*/
          showerr(
            "translated text" + j + "translated text，translated text" + i + "translated text translated text，translated text，translated text！"
          );
          $("cell" + i + j).focus();
          return;
        }
      } else if (tmp != 0) {
        /*translated text*/
        showerr("translated text" + j + "translated text，translated text" + i + "translated text translated text！");
        $("cell" + i + j).focus();
        return;
      }
    }
  }
  if (slove(1, 1)) {
    /*translated text*/
    /*translated text*/
    for (i = 1; i <= 9; i++) {
      for (j = 1; j <= 9; j++) {
        $("cell" + i + j).innerHTML = sd[i][j];
      }
    }
  } else {
    showerr("translated text，translated text～");
  }
};

/*translated text*/
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
    /*translated textfirefoxtranslated text，
  translated text，translated textgoogle chrometranslated text，
  translated texteventtranslated text*/
    bshift = event.shiftKey;
    code = event.keyCode;
  } else {
    code = ev.which; /*Firefoxtranslated textkeyCodetranslated text，translated textwhich*/
    bshift = ev.shiftKey;
  }
  return !bshift && code > 47 && code < 58;
};
```

translated text Javascript，translated text 50%translated text，translated text Javascript translated text，translated text，translated text，translated text。translated text，translated text。

## DIV+CSS translated text

translated text~translated text Javascript，translated text，translated text，translated text，translated text，translated text：

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

CSS translated text：

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

translated text，translated text，translated text，translated text，translated text~
