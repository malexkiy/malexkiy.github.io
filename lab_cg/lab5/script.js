function canvasPrepare() {
    var canvas = document.getElementById('cvs');
        
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.addEventListener('click', on_canvas_click, false);
    
    document.getElementById('rect_btn').disabled = true;
    document.getElementById('clear_btn').disabled = true;
}

var DrawType = {
  NONE: -1,
  LINE: 0,
  RECT: 1
};

var drawType = DrawType.NONE;

var points = [];
var lines = [];
var rect_area = null;

function Point(x_, y_) {
    this.x = (x_);
    this.y = (y_);
}

function Line(p0_, p1_) {
    this.p0 = new Point(p0_.x, p0_.y);
    this.p1 = new Point(p1_.x, p1_.y);
}

function Rect(p0_, p1_) {
    this.p0 = new Point(Math.min(p0_.x, p1_.x), Math.min(p0_.y, p1_.y));
    this.p1 = new Point(Math.max(p0_.x, p1_.x), Math.max(p0_.y, p1_.y));
}

function drawPixel(p, color) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(p.x, p.y, 1, 1);
}

function drawLine(p0_, p1_, color) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = color;
    ctx.moveTo(p0_.x, p0_.y);
    ctx.lineTo(p1_.x, p1_.y);
    ctx.stroke();
}

function drawRect(pS, pE, color) {
    drawLine(new Point(pS.x, pS.y), new Point(pE.x, pS.y), color);
    drawLine(new Point(pE.x, pS.y), new Point(pE.x, pE.y), color);
    drawLine(new Point(pE.x, pE.y), new Point(pS.x, pE.y), color);
    drawLine(new Point(pS.x, pE.y), new Point(pS.x, pS.y), color);
}

function line() {
    drawType = DrawType.LINE;
}

function rect() {
    drawType = DrawType.RECT;
}

function canvas_clear() {
    drawType == DrawType.NONE;
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    document.getElementById('line_btn').disabled = false;
    document.getElementById('clear_btn').disabled = true;
    
    points = [];
    lines = [];
    rect_area = null;
}

function on_canvas_click(ev) {
    var canvas = document.getElementById('cvs');
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    
    if((drawType == DrawType.LINE) || (drawType == DrawType.RECT)) {
        points.push(new Point(x, y));
        drawPixel(new Point(x, y), '#000');

        if(points.length == 2) {
            switch(drawType) {
                case DrawType.LINE:
                    lines.push(new Line(points[0], points[1]));
                    drawLine(points[0], points[1], '#000');
                    
                    document.getElementById('rect_btn').disabled = false;
                    document.getElementById('clear_btn').disabled = false;
                    break;
                case DrawType.RECT:
                    rect_area = new Rect(points[0], points[1]);
                    
                    drawRect(points[0], points[1], '#000');
                    
                    document.getElementById('line_btn').disabled = true;
                    document.getElementById('rect_btn').disabled = true;
                    break;
            }

            points = [];
            
            if(drawType == DrawType.RECT) {
                drawType = DrawType.NONE;
                liang_barsky(rect_area);
            }
        }
    }
}

function maxi(arr, n) {
    var m = 0;
    
    for (var i = 0; i < n; ++i) {
        if (m < arr[i]) {
            m = arr[i];
        }
    }
    
    return m;
}

function mini(arr, n) {
    var m = 1;
    
    for (var i = 0; i < n; ++i) {
        if (m > arr[i]) {
            m = arr[i];
        }
    }
    
    return m;
}

function liang_barsky(window) {    
    for(var i = 0; i < lines.length; i++) {
        
        var p = [
            -(lines[i].p1.x - lines[i].p0.x),
            (lines[i].p1.x - lines[i].p0.x),
            -(lines[i].p1.y - lines[i].p0.y),
            (lines[i].p1.y - lines[i].p0.y)
        ];
        
        var q = [
            lines[i].p0.x - window.p0.x,
            window.p1.x - lines[i].p0.x,
            lines[i].p0.y - window.p0.y,
            window.p1.y - lines[i].p0.y,
        ];
        
        var posarr = [], negarr = [];
        posarr.length = 5;
        negarr.length = 5;
        var posind = 1, negind = 1;
        posarr[0] = 1; negarr[0] = 0;
        
        if ((p[0] == 0 && q[0] < 0) || (p[2] == 0 && q[2] < 0)) {
            console.log("Line is parallel to clipping window!");
            continue;
        }
        
        if (p[0] != 0) {
            var r1 = q[0] / p[0];
            var r2 = q[1] / p[1];
            if (p[0] < 0) {
                negarr[negind++] = r1;
                posarr[posind++] = r2;
            }
            else {
                negarr[negind++] = r2;
                posarr[posind++] = r1;
            }
        }
        if (p[2] != 0) {
            var r3 = q[2] / p[2];
            var r4 = q[3] / p[3];
            if (p[2] < 0) {
                negarr[negind++] = r3;
                posarr[posind++] = r4;
            }
            else {
                negarr[negind++] = r4;
                posarr[posind++] = r3;
            }
        }
        
        var xn1, yn1, xn2, yn2;
        var rn1, rn2;
        rn1 = maxi(negarr, negind);
        rn2 = mini(posarr, posind);
        
        if (rn1 > rn2)  {
            console.log("Line is outside the clipping window!");
            continue;
        }
        
        xn1 = lines[i].p0.x + p[1] * rn1;
        yn1 = lines[i].p0.y + p[3] * rn1;
        xn2 = lines[i].p0.x + p[1] * rn2;
        yn2 = lines[i].p0.y + p[3] * rn2;
        
        drawLine(new Point(xn1, yn1), new Point(xn2, yn2), '#f00');
    }
}