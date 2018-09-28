function canvasPrepare() {
    var canvas = document.getElementById('cvs');
    
    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;*/
    
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.onload = function() {
    	ctx.drawImage(this, 0, 0);
    }
    img.crossOrigin = "Anonymous";
    img.src = document.getElementById('srcImg').src;
}

function blur_wrap() {
    var srcImg = document.getElementById('srcImg');
    blur(srcImg);
}

function blur(srcImg) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');

    var img_width = srcImg.width;
    var img_height = srcImg.height;

    var srcImgData = ctx.getImageData(0, 0, img_width, img_height);

    var i = 0;
}