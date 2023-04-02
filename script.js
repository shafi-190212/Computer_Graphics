var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");
let canvas = document.getElementById("myCanvas");
let angleInput = document.getElementById("angle");
let transformation = "translate";
let conversion = "line";
let param1 = document.getElementById("param1");
let param2Input = document.getElementById("param2");
let param3Input = document.getElementById("param3");
let button= document.getElementById("button");
let xs = [],ys = [];

function selectOption(nameSelect)
{
    var val = nameSelect.options[nameSelect.selectedIndex].value;
    document.getElementById("scan").style.display = val == '1' ? "block" : 'none';
    document.getElementById("transform").style.display = val == '2' ? "block" : 'none';
}

function setTransformation(trans) {
  transformation = trans;
  if (transformation === "translate") {
    param1.innerHTML =
      "Enter distances for translation (in x and y directions):";
    input2.style.display = "none";
    input1.style.display = "block";
  } else if (transformation === "scale") {
    param1.innerHTML = "Enter scaling factors (in x and y directions):";
    input2.style.display = "none";
    input1.style.display = "block";
  }  else if (transformation === "rotate") {
    input1.style.display = "none";
    input2.style.display = "block";
  }
  button.style.display = 'block';
}

function setConversion(scan) {
  conversion = scan;
  if (conversion === "line") {
    para1.innerHTML =
      "Enter the values of (x0,y0) and (x1,y1):";
      circle.style.display = "none";
      ellipse.style.display = "none";
      line.style.display = "block";
      algorithm.style.display = "none";
  } else if (conversion === "circle") {
    para2.innerHTML = "Enter Center and Radius value:";
      circle.style.display = "block";
      ellipse.style.display = "none";
      line.style.display = "none";
      algorithm.style.display = "block";
  }  else if (conversion === "ellipse") {
    para3.innerHTML = "Enter Ellipse value:";
      circle.style.display = "none";
      ellipse.style.display = "block";
      line.style.display = "none";
      algorithm.style.display = "block";
  }
  button1.style.display = 'block';
}

var count = 0;

canvas.addEventListener("mousedown", function (event) {
  let x = event.offsetX;
  let y = event.offsetY;
  xs.push(x);
  ys.push(y);
  console.log(x);
  console.log(y);
  drawAxes();
  drawVertices();
  count++;
  console.log(count);
});

var ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const gridSize = 10;

function grid(){
  // Draw the horizontal lines of the graph paper
  for (let y = 0; y <= canvasHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
  }

  // Draw the vertical lines of the graph paper
  for (let x = 0; x <= canvasWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.strokeStyle = '#ccc';
    ctx.stroke();
  }
}

function plot(x, y) {
  ctx.fillRect(x, y, 1, 1);
}


function drawAxes() {
  ctx.beginPath();
  ctx.moveTo(0, canvasHeight / 2);
  ctx.lineTo(canvasWidth, canvasHeight / 2);
  ctx.moveTo(canvasWidth / 2, 0);
  ctx.lineTo(canvasWidth / 2, canvasHeight);
  ctx.stroke();
}

grid();
drawAxes();

function resetVertices() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid();
  drawAxes();
  xs = [];
  ys = [];
}

function drawVertices() {
  let ctx = canvas.getContext("2d");
  for (let i = 0; i < xs.length; i++) {
    ctx.beginPath();
    ctx.arc(xs[i], ys[i], 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}


function transformPolygon() {
  let n = count;
  let angle = parseInt(angleInput.value);
  let param2 = parseFloat(param2Input.value);
  let param3 = parseFloat(param3Input.value);

  let ctx = canvas.getContext("2d");
  ctx.strokeStyle = "black";
  drawPolygon(ctx, xs, ys);
  if (transformation === "translate") {
    
    let tx = param2;
    let ty = param3;
    //let ty = parseFloat(prompt("Enter y-translation:"));
    if (isNaN(ty)) {
      alert("Please enter valid y-translation");
      return;
    }
    //translate;
    for (let i = 0; i < n; i++) {
      xs[i] += tx;
      ys[i] += ty;
    }
  } else if (transformation === "scale") {
    let sx = param2;
    let sy = param3;
    if (isNaN(sy)) {
      alert("Please enter valid y-scaling factor");
      return;
    }
    let cx = xs.reduce((a, b) => a + b) / n;
    let cy = ys.reduce((a, b) => a + b) / n;
    for (let i = 0; i < n; i++) {
      xs[i] = cx + sx * (xs[i] - cx);
      ys[i] = cy + sy * (ys[i] - cy);
    }
  }else if (transformation === "rotate") {
    // let cx = getCenterX(xs);
    let sum1 = 0;
    for (let i = 0; i < xs.length; i++) {
      sum1 += xs[i];
    }
    let cx = Math.round(sum1 / xs.length);

    let sum2 = 0;
    for (let i = 0; i < ys.length; i++) {
      sum2 += ys[i];
    }
    let cy = Math.round(sum2 / ys.length);
    let cos = Math.cos((angle * Math.PI) / 180);
    let sin = Math.sin((angle * Math.PI) / 180);
    for (let i = 0; i < xs.length; i++) {
      let dx = xs[i] - cx;
      let dy = ys[i] - cy;
      xs[i] = Math.round(dx * cos - dy * sin + cx);
      ys[i] = Math.round(dx * sin + dy * cos + cy);
    }
  }
  ctx.strokeStyle = "blue";
  drawPolygon(ctx, xs, ys);
}

function drawPolygon(ctx, xs, ys) {
  ctx.beginPath();
  ctx.moveTo(xs[0], ys[0]);
  for (let i = 1; i < xs.length; i++) {
    ctx.lineTo(xs[i], ys[i]);
  }
  ctx.closePath();
  ctx.stroke();
}

function draw() {
  if (conversion == "circle") {
    var x0 = parseInt(document.getElementById("xc").value);
    var y0 = parseInt(document.getElementById("yc").value);
    var radius = parseInt(document.getElementById("radius").value);
    var algorithm = document.getElementById("algorithm").value;

    if (algorithm === "midpoint") {
      var x = radius;
      var y = 0;
      var d = 1 - radius;

      while (x > y) {
        plot(x0 + x + canvasWidth / 2, canvasHeight / 2 - (y0 + y));
        plot(x0 + y + canvasWidth / 2, canvasHeight / 2 - (y0 + x));
        plot(x0 - y + canvasWidth / 2, canvasHeight / 2 - (y0 + x));
        plot(x0 - x + canvasWidth / 2, canvasHeight / 2 - (y0 + y));
        plot(x0 - x + canvasWidth / 2, canvasHeight / 2 - (y0 - y));
        plot(x0 - y + canvasWidth / 2, canvasHeight / 2 - (y0 - x));
        plot(x0 + y + canvasWidth / 2, canvasHeight / 2 - (y0 - x));
        plot(x0 + x + canvasWidth / 2, canvasHeight / 2 - (y0 - y));

        if (d < 0) {
          d += 2 * y + 3;
        } else {
          d += 2 * (y - x) + 5;
          x--;
        }

        y++;
      }
    } else if (algorithm === "bresenham") {
      var x = radius;
      var y = 0;
      var d = 3 - 2 * radius;

      while (x > y) {
        plot(x0 + x + canvasWidth / 2, canvasHeight / 2 - (y0 + y));
        plot(x0 + y + canvasWidth / 2, canvasHeight / 2 - (y0 + x));
        plot(x0 - y + canvasWidth / 2, canvasHeight / 2 - (y0 + x));
        plot(x0 - x + canvasWidth / 2, canvasHeight / 2 - (y0 + y));
        plot(x0 - x + canvasWidth / 2, canvasHeight / 2 - (y0 - y));
        plot(x0 - y + canvasWidth / 2, canvasHeight / 2 - (y0 - x));
        plot(x0 + y + canvasWidth / 2, canvasHeight / 2 - (y0 - x));
        plot(x0 + x + canvasWidth / 2, canvasHeight / 2 - (y0 - y));

        if (d < 0) {
          d += 4 * y + 6;
        } else {
          d += 4 * (y - x) + 10;
          x--;
        }

        y++;
      }
    }
  } else if (conversion == "line") {
    var x = parseInt(document.getElementById("x0").value);
    var y = parseInt(document.getElementById("y0").value);
    var x2 = parseInt(document.getElementById("x1").value);
    var y2 = parseInt(document.getElementById("y1").value);
  
  
    let dx = Math.abs(x2 - x);
    let dy = Math.abs(y2 - y);
    let p = 2 * dy - dx;
    let inc = x < x2 ? 1 : -1;
    let inc2 = y < y2 ? 1 : -1;
    let xTemp = x;

    while (xTemp != x2) {
      //plotPoint(xTemp, y, "red");

      plot(canvasWidth / 2 + xTemp, canvasWidth / 2 - y, "red");
      xTemp += inc;
      p += 2 * dy;

      if (p > 0) {
        y += inc2;
        p -= 2 * dx;
      }
    }
  }else if (conversion == "ellipse") {
    // start
  
    var x_center = parseInt(document.getElementById("xe").value);
    var y_center = parseInt(document.getElementById("ye").value);
    var a = parseInt(document.getElementById("a").value);
    var b = parseInt(document.getElementById("b").value);
    let x = 0;
    let y = b;
    const a_sqr = a * a;
    const b_sqr = b * b;
    let fx = 2 * b_sqr * x;
    let fy = 2 * a_sqr * y;
    let d = b_sqr - a_sqr * b + a_sqr * 0.25;
  
    while (fx < fy) {
      drawEllipsePoints(x_center, y_center, x, y);
      if (d < 0) {
        d += fx + b_sqr;
      } else {
        y -= 1;
        d += fx - fy + b_sqr;
        fy -= 2 * a_sqr;
      }
      x += 1;
      fx += 2 * b_sqr;
    }
  
    let tmp1 = (x + 0.5) * (x + 0.5);
    let tmp2 = (y - 1) * (y - 1);
    d = b_sqr * tmp1 + a_sqr * tmp2 - a_sqr * b_sqr;
  
    while (y > 0) {
      drawEllipsePoints(x_center, y_center, x, y);
      if (d >= 0) {
        d -= fy - a_sqr;
      } else {
        x += 1;
        d += fx - fy + a_sqr;
        fx += 2 * b_sqr;
      }
      y -= 1;
      fy -= 2 * a_sqr;
    }
    //}
    function drawEllipsePoints(x_center, y_center, x, y) {
    
      plot(x_center + x + canvasWidth / 2, canvasWidth / 2 - (y_center + y));
      plot(x_center - x + canvasWidth / 2, canvasWidth / 2 - (y_center - y));
      plot(x_center + x + canvasWidth / 2, canvasWidth / 2 - (y_center - y));
      plot(x_center - x + canvasWidth / 2, canvasWidth / 2 - (y_center + y));
    }
  
    // end
  }
}

