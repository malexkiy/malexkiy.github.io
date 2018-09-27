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
        
        var radius = Math.sqrt((cx0-cx1)*(cx0-cx1) + (cy0-cy1)*(cy0-cy1));
        drawCircle(cx0, cy0, radius);
        
        c = 0;
    }
}

function drawCircle(x0, y0, radius) {
	var x = 0;
	var y = radius;
	var delta = 1 - 2 * radius;
	var error = 0;
    var color = '#' + Math.random().toString(16).slice(2, 8).toUpperCase();
    
	while(y >= 0) {
        setPixel(x0 + x, y0 + y, color);
        setPixel(x0 + x, y0 - y, color);
        setPixel(x0 - x, y0 + y, color);
        setPixel(x0 - x, y0 - y, color);
        
        error = 2 * (delta + y) - 1;
        
		if(delta < 0 && error <= 0) {
			++x;
			delta += 2 * x + 1;
			continue;
		}
        
		error = 2 * (delta - x) - 1;
        
		if(delta > 0 && error > 0) {
			--y;
			delta += 1 - 2 * y;
			continue;
		}
        
		++x;
		delta += 2 * (x - y);
		--y;
	}
}
