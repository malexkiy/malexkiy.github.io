function setPixel(x, y, color) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

function canvasPrepare() {
    var canvas = document.getElementById('cvs');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    c = 0;
    canvas.addEventListener('click', on_canvas_click, false);
}

var cx0, cx1, cy0, cy1, c;
function on_canvas_click(ev) {
    var canvas = document.getElementById('cvs');
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;
    
    if(c === 0) {
        cx0 = x;
        cy0 = y;
        c = 1;
    }
    else if(c === 1) {
        cx1 = x;
        cy1 = y;
        
        drawLine(cx0, cy0, cx1, cy1);
        
        c = 0;
    }
}

function drawLine(x1, y1, x2, y2) {
    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    var signX = x1 < x2 ? 1 : -1;
    var signY = y1 < y2 ? 1 : -1;
    var color = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    
    var error = deltaX - deltaY;
    
    setPixel(x2, y2, color);
    
    while(x1 != x2 || y1 != y2) {
        setPixel(x1, y1, color);
        var error2 = error * 2;
        
        if(error2 > -deltaY) {
            error -= deltaY;
            x1 += signX;
        }
        if(error2 < deltaX) {
            error += deltaX;
            y1 += signY;
        }
    }
}
