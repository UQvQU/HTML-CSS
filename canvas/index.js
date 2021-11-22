/*
  顺便思考一下defer 与 load事件的执行顺序
  当页面中有load事件处理程序，又有defer延迟脚本时，首先执行的是defer延迟脚本。
  也就是说，页面加载解析完毕后，立即执行defer延迟脚本，
  然后再执行load事件注册程序 
*/

// 避免不支持console.log的浏览器弹出错误提示
// 新建一个Debugger的类包装console.log
let Debugger = function () {}
Debugger.log = function (msg) {
  try {
    console.log(msg)
  } catch (exception) {
    return
  }
}
// Debugger.log('Drawing Canvas')


// 当同一个页面放置多个canvas应用时，需要将对应的js代码分开
let canvasApp = function () {
  if (!canvasSupport) return
  drawScreen()
  drawClock()
  drawShadow()
  drawImage()

  // first
  function drawScreen() {
    /** @type {HTMLCanvasElement} */ // 提供canvas代码提示，必须放在canvas元素前
    let theCanvas = document.getElementById('firstCan')
    let context = theCanvas.getContext('2d') // 获取2d环境
    // 背景: 填充矩形
    context.fillStyle = 'rgba(0,0,255,0.1)'
    context.fillRect(0, 0, 300, 300) // x坐标 y坐标 width height
    // 文字
    context.fillStyle = '#000'
    context.font = '36px Sans-Serif'
    context.textBaseline = 'top'
    context.fillText('first: hello world!', 20, 50)
    // 图片
    let helloImage = new Image()
    helloImage.src = './img.jpg'
    helloImage.onload = () => { // 待图片加载完成之后才能绘制显示图片
      context.drawImage(helloImage, 20, 120, 240, 160)
    }
    // 边框：描边矩形
    context.strokeStyle = '#6e1'
    context.lineWidth = 10 // 注意先写好样式在绘制
    context.strokeRect(0, 0, 300, 300)

    // 清除某个矩形区域
    context.clearRect(40, 50, 20, 20)

    // 显示图片
    let imgUrl = theCanvas.toDataURL('image/png')
    importImg(imgUrl) // 图片无法导出？？
  }

  // second
  function drawClock() {
    let theCanvas = document.getElementById('secondCan')
    let context = theCanvas.getContext('2d')

    context.fillStyle = "rgba(255,0,0,0.3)";
    context.fillRect(0, 0, 300, 300);

    context.beginPath()

    context.arc(130, 130, 99, 0, 2 * Math.PI, false)

    context.moveTo(224, 130)
    context.arc(130, 130, 94, 0, 2 * Math.PI, false)

    context.moveTo(130, 130)
    context.lineTo(130, 55)

    context.moveTo(130, 130)
    context.lineTo(65, 130)

    context.font = "bold 14px Arial"
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = "rgba(0,0,255,0.5)";
    context.fillText('12', 130, 45)

    context.textAlign = 'start'
    context.fillText('12', 130, 65)

    context.textAlign = 'end'
    context.fillText('12', 130, 85)

    context.fillText('9', 50, 130)

    context.textBaseline = 'top'
    context.fillText('9', 70, 130)

    context.textBaseline = 'bottom'
    context.fillText('9', 80, 130)

    context.textBaseline = "hanging"
    context.fillText('9', 90, 130)

    context.textBaseline = "alphabetic"
    context.fillText('9', 100, 130)

    context.textBaseline = "ideographic"
    context.fillText('9', 110, 130)

    context.stroke()
    context.save()

    // 测试save() restore()
    context.fillStyle = "#ff0000"; //红
    context.save();

    context.fillStyle = "#00ff00"; //绿

    context.translate(250, 250); // 更换原点坐标
    context.rotate(Math.PI / 2) // Math.PI： 180度；设置旋转后，之后的所有元素都围绕当前原点旋转，设置旋转前的元素不变

    context.moveTo(50, 0)
    context.arc(0, 0, 50, 0, 2 * Math.PI, false)

    context.moveTo(0, 0)
    context.lineTo(45, 0)

    context.stroke()
    context.save();

    context.fillStyle = "#0000ff"; //蓝
    context.fillRect(0, 0, 10, 20); //从点(100,100)开始绘制蓝色矩形
    context.restore();

    context.fillRect(10, 10, 10, 20); //从点(110,110)开始绘制绿色矩形
    context.restore();

    context.fillRect(0, 0, 10, 10)

    // 绘制图像
    context.translate(0, 0)
    let helloImage = new Image()
    helloImage.src = './img.jpg'
    helloImage.onload = () => { // 待图片加载完成之后才能绘制显示图片
      context.drawImage(helloImage, 0, 200, 150, 100)
      context.drawImage(helloImage, 0, 0, 500, 400, 200, 0, 60, 80)
    }

  }

  // third
  function drawShadow() {
    let theCanvas = document.getElementById('thirdCan')
    let context = theCanvas.getContext('2d')

    // 设置阴影
    context.shadowOffsetX = 5
    context.shadowOffsetY = 5
    context.shadowBlur = 4
    context.shadowColor = 'rgba(106, 90, 205, 0.3)'

    // 边框
    context.strokeStyle = '#abe'
    context.strokeRect(0, 0, 300, 300)

    // 背景
    context.translate(10, 10)
    context.fillStyle = 'rgba(200, 238, 200, 1)'
    context.fillRect(0, 0, 280, 280)

    context.fillStyle = '#ab1'
    context.fillRect(30, 40, 50, 20)

    context.strokeStyle = '#ab1'
    context.lineWidth = 3
    context.strokeRect(210, 40, 50, 20)

    let gradient = context.createLinearGradient(0, 0, 280, 280)
    gradient.addColorStop(0, '#F0FFFF')
    gradient.addColorStop(1, '#4682B4')
    context.strokeStyle = gradient
    context.shadowColor = 'rgba(100,149,237, 0.1)'

    // 页面滚动会导致坐标不准确，得重新计算
    function write(event) {
      // 鼠标坐标 - 画布坐标
      let x = event.clientX - theCanvas.offsetLeft
      let y = event.clientY - theCanvas.offsetTop
      // console.log('move', x, y)
      // 减去鼠标translate的距离
      context.lineTo(x - 10, y - 10)
      context.stroke()
    }

    // 清空路径
    function clearPath(event) {
      if (event.keyCode == 8) {
        // console.log('清空')
        context.translate(0, 0)
        context.clearRect(-10, -10, theCanvas.width, theCanvas.height)
        context.strokeStyle = '#abe'
        context.strokeRect(-10, -10, 300, 300)
        context.beginPath()
      }
    }
    // 监听backspace键
    document.onkeydown = clearPath

    // 监听鼠标按下
    theCanvas.addEventListener('mousedown', (event) => {
      // console.log('down', event.button, theCanvas.offsetLeft, theCanvas.offsetTop)
      context.beginPath()
      // 监听鼠标移动
      theCanvas.addEventListener('mousemove', write)
    })
    // 监听鼠标松开
    theCanvas.addEventListener('mouseup', () => {
      // console.log('up')
      theCanvas.removeEventListener('mousemove', write)
    })
    // 监听鼠标离开
    theCanvas.addEventListener('mouseleave', () => {
      // console.log('leave')
      theCanvas.removeEventListener('mousemove', write)
    })

  }

  // fourth
  function drawImage() {
    let theCanvas = document.getElementById('fourthCan')
    let context = theCanvas.getContext('2d')

    context.fillStyle = '#5F9EA0'
    context.fillRect(0, 0, 300, 300)

    context.globalAlpha = 0.8

    //图片存储在本地时，是默认没有域名的，用getImageData方法时，浏览器会判定为跨域而报错！
    // 解决办法：开启live server
    let image = new Image()
    // image.crossOrigin = "Anonymous"; //注意存放顺序
    image.src = './img.jpg'
    image.onload = () => {
      context.drawImage(image, 10, 10, 200, 150)
      let imageData = context.getImageData(10, 10, 200, 150)
      let data = imageData.data
      // console.log('data', imageData, data)
      for (let i = 0, len = data.length; i < len; i += 4) {
        let red = data[i]
        let green = data[i + 1]
        let blue = data[i + 2]

        let average = Math.floor((red + green + blue) / 3)

        data[i] = data[i + 1] = data[i + 2] = average
      }

      imageData.data = data
      context.putImageData(imageData, 90, 120)
    }

    context.strokeStyle = '#abe'
    context.lineWidth = 10
    context.strokeRect(50, 50, 200, 80)
  }

  // 显示画布导出的图片
  function importImg(imgUrl) {
    let image = document.createElement('img')
    image.src = imgUrl
    document.body.append(image)
  }
}

window.onload = canvasApp

// 检验浏览器是否支持canvas
let canvasSupport = function () {
  return !!document.createElement('canvas').getContext
}