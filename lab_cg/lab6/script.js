function canvasPrepare() {
    var canvas = document.getElementById('cvs');
        
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.addEventListener('click', on_canvas_click, false);
    canvas.addEventListener('contextmenu', on_canvas_rclick, false);
    
    document.getElementById('polygon_btn').disabled = true;
    document.getElementById('clear_btn').disabled = true;
}

var DrawType = {
  NONE: -1,
  LINE: 0,
  POLYGON: 1
};

var drawType = DrawType.NONE;

var points = [];
var lines = [];
var window_area = null;

function Point(x_, y_) {
    this.x = (x_);
    this.y = (y_);
}

function Line(p0_, p1_) {
    this.p0 = new Point(p0_.x, p0_.y);
    this.p1 = new Point(p1_.x, p1_.y);
}

function Polygon(pts_) {
    this.pts = [];
    
    for(var i = 0; i < pts_.length; i++) {
        this.pts.push(new Point(pts_[i].x, pts_[i].y));
    }
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

function drawPolygon(polygon_, color) {
    for(var i = 0; i < polygon_.pts.length - 1; i++) {
        drawLine(polygon_.pts[i], polygon_.pts[i + 1], color);
    }
    drawLine(polygon_.pts[polygon_.pts.length - 1], polygon_.pts[0], color);
}

function line() {
    drawType = DrawType.LINE;
}

function polygon() {
    drawType = DrawType.POLYGON;
}

function canvas_clear() {
    drawType = DrawType.NONE;
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    document.getElementById('line_btn').disabled = false;
    document.getElementById('clear_btn').disabled = true;
    document.getElementById('error').innerHTML = '';
    
    points = [];
    lines = [];
    window_area = null;
}

function on_canvas_click(ev) {
    var canvas = document.getElementById('cvs');
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    
    if(drawType == DrawType.LINE) {
        points.push(new Point(x, y));
        drawPixel(new Point(x, y), '#000');
        
        if(points.length == 2) {
            lines.push(new Line(points[0], points[1]));
            drawLine(points[0], points[1], '#000');
            
            drawType = DrawType.NONE;
            
            document.getElementById('line_btn').disabled = true;
            document.getElementById('polygon_btn').disabled = false;
            document.getElementById('clear_btn').disabled = false;
            
            points = [];
        }
    }
    else if(drawType == DrawType.POLYGON) {
        points.push(new Point(x, y));
        drawPixel(new Point(x, y), '#000');
    }
}

function on_canvas_rclick(ev) {
    ev.preventDefault();
    
    if(points.length == 0) {
        return;
    }
    
    drawType = DrawType.NONE;
    document.getElementById('polygon_btn').disabled = true;
    
    window_area = new Polygon(points);
    points = [];
    drawPolygon(window_area, '#000');
    
    cyrus_beck(window_area, lines[0]);
}

function cyrus_beck(window_area_, l) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(window_area_.pts.length < 3) {
        document.getElementById('error').innerHTML = 'Error: Figure is not a polygon';
        console.log('Wrong polygon');
        return;
    }
    
    drawPolygon(window_area_, '#000');
    
    var delX = l.p1.x - l.p0.x;
    var delY = l.p1.y - l.p0.y;
    var D = new Point(delX, delY);

    var boundaryPoint = window_area_.pts[2];
    var tEnter = 0;
    var tLeave = 1;
        
    for(var i = 0; i < window_area_.pts.length; i++) {
        var j = i;
        
        var p = window_area_.pts[j];
        j = (i + 1) % window_area_.pts.length;
        var q = window_area_.pts[j];
        
        var line = new Line(p, q);
        var n = getInsideNormal(line, boundaryPoint);
        var w = new Point(l.p0.x - p.x, l.p0.y - p.y);
        var num = dotProduct(w, n);
        var den = dotProduct(D, n);
        
        if(den == 0) {
            if(num < 0) {
                return;
            }
            else {
                continue;
            }
        }

        var t = -num/den;
        if(den > 0) {
            tEnter = Math.max(tEnter, t);
        }
        else {
            tLeave = Math.min(tLeave, t);
        }
        boundaryPoint = p;
    }
    
    if(tEnter > tLeave) {
        document.getElementById('error').innerHTML = 'Error: Polygon is not convex';
        console.log('Polygon is not convex');
        return;
    }
    
    var x1 = l.p0.x + delX * tEnter;
    var y1 = l.p0.y + delY * tEnter;
    var x2 = l.p0.x + delX * tLeave;
    var y2 = l.p0.y + delY * tLeave;
    
    drawLine(new Point(x1, y1), new Point(x2, y2), '#f00');
}

function dotProduct(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y;
}

function getInsideNormal(l, z) {
    var delX = l.p1.x - l.p0.x;
    var delY = l.p1.y - l.p0.y;
    
    var n = new Point(-delY, delX);
    var v = new Point(z.x - l.p0.x, z.y - l.p0.y);
    
    var dot = dotProduct(v, n);
    
    if(dot == 0) {
        document.getElementById('error').innerHTML = 'Error: 3 collinear points along polygon';
        console.log('Error - 3 collinear points along polygon');
        return;
    }
    if(dot < 0) {
        n.x *= -1;
        n.y *= -1;
    }
    
    return n;
}