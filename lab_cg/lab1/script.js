function canvasPrepare() {
    var canvas = document.getElementById('cvs');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setInterval(animation, 500);
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function drawLine(x0, y0, x1, y1, color, weight) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
}

function drawClockHand(length, color, type, weight) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    var cx = canvas.width / 2,
        cy = canvas.height / 2;
    
    var d = new Date();
    var h = d.getHours() % 12;
    var m = d.getMinutes();
    var s = d.getSeconds();
    
    var base = 60;
    var t;
    var angle;
    if(type == 'h') {
        angle = toRadians(h*30 + m/12*6 - 90);
    }
    else if (type == 'm') {
        angle = toRadians(m*6 - 90);
    }
    else if (type == 's') {
        angle = toRadians(s*6 - 90);
    }
    
    var x = cx + length * Math.cos(angle);
    var y = cy + length * Math.sin(angle);
    
    drawLine(cx, cy, x, y, color, weight);
}

function animation() {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    var hl = 100;
    var ml = 200;
    var sl = 200;
    
    drawClockHand(sl, '#00f', 's', 5);
    drawClockHand(ml, '#0f0', 'm', 10);
    drawClockHand(hl, '#f00', 'h', 20);
}
