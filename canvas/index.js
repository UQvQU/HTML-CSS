/*
  顺便思考一下defer 与 load事件的执行顺序
  当页面中有load事件处理程序，又有defer延迟脚本时，首先执行的是defer延迟脚本。
  也就是说，页面加载解析完毕后，立即执行defer延迟脚本，
  然后再执行load事件注册程序 
*/


// 当同一个页面放置多个canvas应用时，需要将对应的js代码分开
let canvasApp = function () {
  if (!canvasSupport) return
  drawScreen() // 其中一个canvas应用
  function drawScreen() {
    /** @type {HTMLCanvasElement} */ // 提供canvas代码提示，必须放在canvas元素前
    let theCanvas = document.getElementById('firstCan')
    let context = theCanvas.getContext('2d') // 获取2d环境
    console.log(context)
    // 背景
    context.fillStyle = '#eff'
    context.fillRect(0, 0, 300, 300) // x坐标 y坐标 width height
    // 文字
    context.fillStyle = '#000'
    context.font = '36px Sans-Serif'
    context.textBaseline = 'top'
    context.fillText('hello world!', 20, 50)
    // 图片
    let helloImage = new Image()
    helloImage.src = './img.jpg'
    helloImage.onload = () => { // 待图片加载完成之后才能绘制显示图片
      context.drawImage(helloImage, 20, 120)
    }
    // 边框
    context.strokeStyle = '#6e1'
    context.strokeRect(0, 0, 300, 300)
  }
}

window.onload = canvasApp

// 检验浏览器是否支持canvas
let canvasSupport = function () {
  return !!document.createElement('canvas').getContext
}

// 避免不支持canvas的浏览器弹出错误提示
Debugger.log('Drawing Canvas')
let Debugger = function () {}
Debugger.log = function (msg) {
  try {
    console.log(msg)
  } catch (exception) {
    return
  }
}