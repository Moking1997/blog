--- 
title: 「Canvas 动画 」- 烟花
date: 2020-02-22
tags:  
- Canvas
categories:
- Canvas
---

## [效果查看](/show/firework/firework.html)
![烟花](/show/firework/firework.gif)

## 前言
在开发之前,我们要了解一下烟花从上升到爆炸的过程:

 	1. 设定烟花初始位置,爆炸位置,朝终点飞行
 	2. 受重力作用, 上升速度逐渐减慢
 	3. 烟花到达爆炸位置,爆炸散发出火花,烟花圆点消失
 	4. 火花以爆炸位置为圆心,向四周扩散,并且高度缓慢下降
 	5. 经过短暂时间,火花消失

由此,我们可以先列出主要对象和属性:

 - 烟花
    - 实时坐标: `(x, y)`
    - 颜色:`color`
    - 半径:`radius`
    - 携带爆炸火花:`booms`
    - 发生爆炸坐标:`boomPoint`
    - 是否已经爆炸:`dead`
- 火花
   - 实时坐标: `(x, y)`
   - 爆炸圆心:`(centerX, centerY)`
   - 飞行目标坐标:`dieX, dieY`
   - 颜色:`color`
   - 半径:`radius`
   - 是否已经消失:`dead`

## 基本框架

```js
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const _W = canvas.width = window.innerWidth
const _H = canvas.height = window.innerHeight

class FireWork {
  constructor(x, radius, color, boomPoint) {
    this.x = x
    this.y = _W
    this.radius = radius
    this.color = color
    this.booms = []
    this.boomPoint = boomPoint
    this.dead = false
  }
}

class Spark {
  constructor(centerX, centerY, radius, color, dieX, dieY) {
    this.dieX = dieX;
    this.dieY = dieY;
    this.x = centerX;
    this.y = centerY;
    this.dead = false;
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
    this.color = color;
  }
}
// 动画函数,实时清空画布并重新绘制
const animation = function () {
  window.requestAnimationFrame(animation);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 绘制...
};

animation()
```



## 烟花飞行

```js
const random = function (min, max) {
  return Math.random() * (max - min) + min
}

class FireWork {
  constructor(x, radius, color, boomPoint) {
    this.x = x
    this.y = _W
    this.radius = radius
    this.color = color
    this.booms = []
    this.boomPoint = boomPoint
    this.boomArea = random(60, 150) // 距离范围
    this.dead = false
  }

  move() {
    // 与爆炸位置的距离,逐渐变小
    let dx = this.boomPoint.x - this.x
    let dy = this.boomPoint.y - this.y
    // 跟随距离改变上升速度,逐渐变慢
    this.x = this.x + dx * 0.01
    this.y = this.y + dy * 0.01
    // 后期烟花移动速度过慢,故给一个距离范围,进入范围便爆炸
    if (Math.abs(dx) <= this.boomArea && Math.abs(dy) <= this.boomArea) {
      this.dead = true
    }
  }

  draw() {
    ctx.save()
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.restore()
  }
	// 模拟烟花尾随特效
  drawTail() {
    ctx.save()
    ctx.fillStyle = "rgba(186,186,86,0.3)"
    ctx.beginPath()
    ctx.arc(this.x, this.y, random(this.radius, this.radius + 4), 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  }

  update() {
    if (!this.dead) {
      this.move()
      this.draw()
      this.drawTail()
    }
  }
}

 const o = new FireWork(_W / 2, 3, "#FFF", {
        x: _W / 2,
        y: 10
    })

 const animation = function () {
   window.requestAnimationFrame(animation);
   // 使用 透明度0.1填充画布,实现烟花拖拽特效
   ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   o.update()
 };

animation()
```

## 火花飞行

```js
class Spark {
  constructor(centerX, centerY, radius, color, dieX, dieY) {
    this.dieX = dieX;
    this.dieY = dieY;
    this.x = centerX;
    this.y = centerY;
    this.dead = false;
    this.centerX = centerX;
    this.centerY = centerY;
    // 火花大小差异化
    this.radius = random(radius, radius + 2);
    this.color = color;
  }
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill()
    ctx.restore();
  }
  move() {
    // 模拟重力下降
    this.dieY = this.dieY + this.radius / 10
    let dx = this.dieX - this.x
    let dy = this.dieY - this.y
    // 如果距离小于 0.1 则坐标直接等于消失坐标
    this.x = Math.abs(dx) < 0.1 ? this.dieX : (this.x + dx * 0.1);
    this.y = Math.abs(dy) < 0.1 ? this.dieY : (this.y + dy * 0.1);
    // x 达到消失坐标,则消失
    if (dx == 0 && Math.abs(dy) <= 80) {
      this.dead = true;
    }
  }
  update() {
    if (!this.dead) {
      this.move()
      this.draw()
    }
  }
}
```

## 烟花爆炸

```js
class FireWork {
	// ...省略
  move() {
    let dx = this.boomPoint.x - this.x
    let dy = this.boomPoint.y - this.y
    this.x = this.x + dx * 0.01
    this.y = this.y + dy * 0.01
    if (Math.abs(dx) <= this.boomArea && Math.abs(dy) <= this.boomArea) {
      this.dead = true
      // 烟花到达爆炸点,初始化火花对象
      this.initBoom() 
    }
  }

  initBoom() {
    // 随机爆炸数量
    let num = random(50, 200)
    for (let i = 0; i < num; i++) {
      // 随机爆炸角度
      let tan = random(-Math.PI, Math.PI);
      let x = random(0, 400) * Math.cos(tan) + this.x;
      let y = random(0, 400) * Math.sin(tan) + this.y;
      let boom = new Spark(this.x, this.y, random(0, 2), randomColor(), x, y);
      this.booms.push(boom);
    }
  }
	// 火花爆炸函数
  boomAction() {
    for (let i = 0; i < this.booms.length; i++) {
      if (!this.booms[i].dead) {
        this.booms[i].update();
      }
    }
  }

  update() {
    if (!this.dead) {
      this.move()
      this.draw()
      this.drawTail()
    } else {
      this.boomAction()
    }
  }
}
```



## 最终代码

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>烟花</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    </style>
</head>

<body>
    <canvas id='canvas'></canvas>
</body>
<script>
    const random = function (min, max) {
        return Math.random() * (max - min) + min
    }
    const randomColor = function () {
        let colors = [
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
        ];

        let num = Math.floor(Math.random() * colors.length)
        return colors[num]
    };
    const canvas = document.querySelector("#canvas")
    const ctx = canvas.getContext("2d")
    const _W = canvas.width = window.innerWidth
    const _H = canvas.height = window.innerHeight

    class FireWork {
        constructor(x, radius, color, boomPoint) {
            this.x = x
            this.y = _W
            this.radius = radius
            this.color = color
            this.booms = []
            this.boomPoint = boomPoint
            this.boomArea = random(60, 150)
            this.dead = false
            this.sparkDead = false
        }

        move() {
            // 与爆炸位置的距离,逐渐变小
            let dx = this.boomPoint.x - this.x
            let dy = this.boomPoint.y - this.y
            // 跟随距离改变上升速度,逐渐变慢
            this.x = this.x + dx * 0.01
            this.y = this.y + dy * 0.01
            // 后期烟花移动速度过慢,故给一个距离范围,进入范围便爆炸
            if (Math.abs(dx) <= this.boomArea && Math.abs(dy) <= this.boomArea) {
                this.dead = true
                this.initBoom()
            }
        }

        draw() {
            ctx.save()
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
            ctx.fillStyle = this.color
            ctx.fill()
            ctx.restore()
        }

        drawTail() {
            ctx.save()
            ctx.fillStyle = "rgba(186,186,86,0.3)"
            ctx.beginPath()
            ctx.arc(this.x, this.y, random(this.radius, this.radius + 4), 0, 2 * Math.PI)
            ctx.fill()
            ctx.restore()
        }

        initBoom() {
            let num = random(50, 200)
            for (let i = 0; i < num; i++) {
                let tan = random(-Math.PI, Math.PI);
                let x = random(0, 250) * Math.cos(tan) + this.x;
                let y = random(0, 250) * Math.sin(tan) + this.y;
                let boom = new Spark(this.x, this.y, random(0, 1), randomColor(), x, y);
                this.booms.push(boom);
            }
        }

        boomAction() {
            let deadNum = 1
            for (let i = 0; i < this.booms.length; i++) {
                if (!this.booms[i].dead) {
                    this.booms[i].update();
                } else {
                    deadNum++
                }
            }
            if (deadNum == this.booms.length) this.sparkDead = true
        }

        update() {
            if (!this.dead) {
                this.move()
                this.draw()
                this.drawTail()
            } else {
                this.boomAction()
            }
        }
    }

    class Spark {
        constructor(centerX, centerY, radius, color, dieX, dieY) {
            this.dieX = dieX;
            this.dieY = dieY;
            this.x = centerX;
            this.y = centerY;
            this.dead = false;
            this.centerX = centerX;
            this.centerY = centerY;
            // 火花大小差异化
            this.radius = random(radius, radius + 1);
            this.color = color;
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill()
            ctx.restore();
        }
        move() {
            // 模拟重力下降
            this.dieY = this.dieY + this.radius / 10
            let dx = this.dieX - this.x
            let dy = this.dieY - this.y
            // 如果距离小于 0.1 则坐标直接等于消失坐标
            this.x = Math.abs(dx) < 0.1 ? this.dieX : (this.x + dx * 0.1);
            this.y = Math.abs(dy) < 0.1 ? this.dieY : (this.y + dy * 0.1);
            // x 达到消失坐标,则消失
            if (dx == 0 && Math.abs(dy) <= 80) {
                this.dead = true;
            }
        }
        update() {
            if (!this.dead) {
                this.move()
                this.draw()
            }
        }
    }

    const particles = []
    let oldTime = new Date()

    const animation = function () {
        window.requestAnimationFrame(animation);
        // 使用 透明度0.1填充画布,实现烟花拖拽特效
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 间隔时间生成烟花
        let newDate = new Date()
        if (newDate - oldTime > random(300, 1500)) {
            let o = new FireWork(random(_W / 4, 0.8 * _W), 3, "#FFF", {
                x: random(_W / 4, 0.8 * _W),
                y: random(50, 200)
            })
            particles.push(o)
            oldTime = newDate
        }
        // 遍历烟花和删除死亡烟花
        particles.forEach((element, index) => {
            element.update()
            if (element.sparkDead) {
                particles.splice(index, 1);
            }
        });
    };

    animation()
</script>

</html>
```

