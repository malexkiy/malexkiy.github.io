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

function get_rgba(x, y, imgData) {
    var data = imgData.data;
    var imageWidth = imgData.width;
    
    var r = data[((imageWidth * y) + x) * 4];
    var g = data[((imageWidth * y) + x) * 4 + 1];
    var b = data[((imageWidth * y) + x) * 4 + 2];
    var a = data[((imageWidth * y) + x) * 4 + 3];
    
    return [r, g, b, a];
}

function blur(srcImg) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');

    var img_width = srcImg.width;
    var img_height = srcImg.height;

    var srcImgData = ctx.getImageData(0, 0, img_width, img_height);

    var blurImgData = ctx.getImageData(img_width + 10, 0, img_width, img_height);
    
    for(var x = 1; x < img_width - 1; x++) {
        for(var y = 1; y < img_height - 1; y++) {
            var pixel = get_rgba(x, y, srcImgData);
        }
    }
}
