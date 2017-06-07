---
layout: post
title: "用 Visual Basic 实现一个超级简单的射击游戏"
date: 2010-10-01 04:23:29 +0000
---

其实真的很简单一件事情，无外乎3个事件处理：鼠标移动、鼠标点击、敌人状态周期。

```VB
Dim TimerCount As Integer, Life As Integer, Score As Integer, AnimyLife As Integer, AimAtAnimy As Boolean

Private Sub BackGround_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
    '背景图片一个PictureBox，可以容纳其他图片
    '这个 过程(Sub) ，是当鼠标在背景图片上移动时触发的，Button参数表示移动的同时按着那个键（键盘），Shift表示是否按着Shift键
    'X、Y表示鼠标位置相对于图片左上角的坐标
    '下面，通过计算，得出焦点图片的相对于背景图片的坐标，直接修改焦点图片的坐标，就实现了移动焦点的功能
    Focus.Top = Y - Focus.Height / 2
    Focus.Left = X - Focus.Width / 2
    '这个当且仅当鼠标在背景上面而不在焦点图片上才执行，因为焦点图片在背景图片上方，所以以后移动的时候就不会触发这个事件了，而是触发 Focus_MouseMove 这个过程。
End Sub

Private Sub Focus_Click()
    '这个 过程 ，是当焦点图片被点击的时候触发的
    '很明显，当用户的鼠标在焦点图片上面的时候，点击就意味这射击
    If AimAtAnimy Then '由于每一次鼠标移动，都会标记是否已经瞄准敌人，这里可以省去在获取鼠标位置麻烦的过程
        AnimyLife = AnimyLife - 1 '敌人生命-1
        If AnimyLife <= 0 Then '敌人死了
            Score = Score + 10 '加分
            TimerCount = 0 '敌人的时间轴为0（重置敌人）
            animy.Visible = False '刚刚开始敌人不可见
        End If
    End If
End Sub

Private Sub Focus_MouseMove(Button As Integer, Shift As Integer, X As Single, Y As Single)
    '这个 过程 ，是当鼠标在焦点图片上移动时触发的
    '参数描述同 BackGround_MouseMove
    '计算新的焦点图片的坐标
    Focus.Top = Focus.Top + Y - Focus.Height / 2
    Focus.Left = Focus.Left + X - Focus.Width / 2
    '判断是否瞄准了敌人
    If animy.Visible And Focus.Top + Y >= animy.Top And Focus.Top + Y <= animy.Top + animy.Height And Focus.Left + X >= animy.Left And Focus.Left + X <= animy.Left + animy.Width Then
        AimAtAnimy = True
    Else
        aimaranimy = False
    End If
End Sub

Private Sub Form_Load()
    '当窗体加载时载入，也就是打开游戏程序时载入
    'MsgBox star.Top - animy.Top & " " & star.Left - animy.Left
    '240 1440
    '上面那两个数字是闪烁的 星星图片 和 敌人图片 对应的枪口位置的相对坐标，当初用 msgbox 弹出来的，这里记录一下而已。
    '基本的初始化
    Information.Caption = "请点击 开始 按钮开始游戏！"
    Randomize
End Sub

Private Sub Start_Click()
    '点击了 开始 按钮，初始化游戏
    Timer.Enabled = True '开始游戏计时器 200ms
    TimerCount = 0 '敌人时间轴
    Score = 0 '分数
    Life = 100 '玩家生命
    Focus.Visible = True '焦点图片可见
End Sub

Private Sub Timer_Timer()
    '计时器过程，每 200ms 执行一次
    If TimerCount = 0 Then '当敌人时间轴为0时，初始化敌人参数
        AnimyLife = 5 '敌人生命
        AimAtAnimy = False '是否瞄准了敌人
        animy.Visible = False '敌人还不可见
        star.Visible = False '闪烁的 星星图片 不可见，闪一下星星表示敌人开一次枪
    ElseIf TimerCount = 2 Then '时间轴到2了，也就是敌人初始化 400ms 后
        '随机确定敌人出现的位置
        animy.Top = (BackGround.Height - animy.Height) * Rnd
        animy.Left = (BackGround.Width - animy.Width) * Rnd
        '根据测试（ FormLoad过程 那个 msgbox ）的相对坐标，把 闪烁星星 的位置也更新一下
        star.Top = animy.Top + 240
        star.Left = animy.Left + 1440
        animy.Visible = True '敌人出场
    ElseIf TimerCount >= 10 Then '时间轴大于等于10了，也就是敌人活到了初始化后的 2s ，出现后的 1800ms ，还没被射死，开始攻击玩家
        If TimerCount Mod 3 = 1 Then '当时间轴对3求余等于1，也就是10(2s) 13(2.6s) 16(3.2)这些时间轴时，使星星闪烁，当星星可见时射杀玩家，也就是10(2s) 16(3.2s) 22(4.4s)这些时间轴时射杀玩家
            star.Visible = Not star.Visible
            If star.Visible Then
                Life = Life - 5
            End If
        End If
        If Life <= 0 Then '玩家死了
            Focus.Visible = False '焦点不可用了
            MsgBox "噢，很可惜，你输了！你的得分是：" & Score, vbOKOnly, "游戏结束"
            Information.Caption = "请点击 开始 按钮开始游戏！"
            '游戏结束
            Timer.Enabled = False
            Exit Sub
        End If
    End If
    Information.Caption = "得分：" & Score & "   您的生命：" & Life & "  当前敌人生命：" & AnimyLife
    TimerCount = TimerCount + 1 '本次时间轴计算完成，时间轴加1
End Sub
```
