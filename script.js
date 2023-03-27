var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");

//orginal week
let canvas = document.getElementById("myCanvas");
let angleInput = document.getElementById("angle");
let transformation = "translate";
let param1 = document.getElementById("param1");
let param2Input = document.getElementById("param2");
let param3Input = document.getElementById("param3");
let button= document.getElementById("button");
let xs = [],ys = [];

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
  drawVertices();
}

function drawVertices() {
  let ctx = canvas.getContext("2d");
  for (let i = 0; i < xs.length; i++) {
    ctx.beginPath();
    ctx.arc(xs[i], ys[i], 5, 0, 2 * Math.PI);
    ctx.fill();
  }
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

