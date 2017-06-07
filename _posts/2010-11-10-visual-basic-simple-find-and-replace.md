---
layout: post
title: "VB里面的简单查找替换"
date: 2010-11-09 23:30:21 +0000
---

这次超水…… 这个是昨天的实验课，但是，原来以为会比较复杂，想不到，嘿嘿，水掉了，一个InStr这个函数被我用得，诶哟哟…… 主窗体代码：

```VB
Private Sub cmdFR_Click()
    fmFR.Show 0, Me
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Unload fmFR
End Sub
查找替换窗口的代码：

Function Sel()
    Sel = InStr(fmMain.txtCnt.SelStart + fmMain.txtCnt.SelLength + 1, fmMain.txtCnt.Text, txtFnd.Text)
    If Sel <> 0 Then
        fmMain.txtCnt.SelStart = Sel - 1
        fmMain.txtCnt.SelLength = Len(txtFnd.Text)
    End If
End Function

Private Sub cmdEnd_Click()
    Me.Hide
End Sub

Private Sub cmdFnd_Click()
    fmMain.txtCnt.SelStart = 0
    fmMain.txtCnt.SelLength = 0
    If Sel = 0 Then
        MsgBox "没有找到匹配的字符串！", vbOKOnly, "查找"
    End If
End Sub

Private Sub cmdFndNxt_Click()
    If Sel = 0 Then
        MsgBox "没有找到下一个匹配的字符串！", vbOKOnly, "查找下一个"
    End If
End Sub

Private Sub cmdRpl_Click()
    If Sel = 0 Then
        MsgBox "光标之后没有找到要替换的字符串！", vbOKOnly, "替换"
    Else
        fmMain.txtCnt.SelText = txtRpl.Text
    End If
End Sub

Private Sub cmdRplAll_Click()
    Dim Count As Integer
    Count = 0
    fmMain.txtCnt.SelStart = 0
    fmMain.txtCnt.SelLength = 0
    While Sel <> 0
        Count = Count + 1
        fmMain.txtCnt.SelText = txtRpl.Text
    Wend
    MsgBox "替换完成，一共完成 " & Count & "次替换！", vbOKOnly, "全部替换"
End Sub
```

工程实在水得不能再水了，反正这个博客没东西，刷屏之。

<!--
昨天过得挺开心的，下午vb实验课一直呆在她旁边，教她做上次的内容，然后4个人一起去了市区，一起晚饭……很喜欢……
-->
