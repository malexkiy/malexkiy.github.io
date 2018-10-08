function canvasPrepare() {
    var canvas = document.getElementById('cvs');
        
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var img = new Image();
    img.onload = function() {
    	ctx.drawImage(this, 0, 0);
        sobel_wrap();
    }
    img.crossOrigin = "Anonymous";
    img.src = document.getElementById('srcImg').src;
}

function sobel_wrap() {
    var srcImg = document.getElementById('srcImg');
    sobel(srcImg);
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

function set_rgba(x, y, imgData, rgba) {
    var data = imgData.data;
    var imageWidth = imgData.width;
    
    data[((imageWidth * y) + x) * 4] = rgba[0];
    data[((imageWidth * y) + x) * 4 + 1] = rgba[1];
    data[((imageWidth * y) + x) * 4 + 2] = rgba[2];
    data[((imageWidth * y) + x) * 4 + 3] = rgba[3];
}

function imgPrepare(srcImg) {
    var tmpImg = new ImageData(srcImg.width + 2, srcImg.height + 2);
    
    for(var x = 0; x < srcImg.width; x++) {
        for(var y = 0; y < srcImg.height; y++) {
            set_rgba(x + 1, y + 1, tmpImg, get_rgba(x, y, srcImg));
        }
    }
    
    for(var x = 1, y = 0; x < tmpImg.width - 1; x++) {
        set_rgba(x, y, tmpImg, get_rgba(x, y + 1, tmpImg));
    }
    
    for(var x = 1, y = tmpImg.height - 1; x < tmpImg.width - 1; x++) {
        set_rgba(x, y, tmpImg, get_rgba(x, y - 1, tmpImg));
    }
    
    for(var x = 0, y = 1; y < tmpImg.height - 1; y++) {
        set_rgba(x, y, tmpImg, get_rgba(x + 1, y, tmpImg));
    }
    
    for(var x = tmpImg.width - 1, y = 1; y < tmpImg.height - 1; y++) {
        set_rgba(x, y, tmpImg, get_rgba(x - 1, y, tmpImg));
    }
    
    var x = 0, y = 0;
    set_rgba(x, y, tmpImg, get_rgba(x + 1, y + 1, tmpImg));
    
    x = tmpImg.width - 1;
    set_rgba(x, y, tmpImg, get_rgba(x - 1, y + 1, tmpImg));
    
    y = tmpImg.height - 1;
    set_rgba(x, y, tmpImg, get_rgba(x - 1, y - 1, tmpImg));
    
    x = 0;
    set_rgba(x, y, tmpImg, get_rgba(x + 1, y - 1, tmpImg));
    
    return tmpImg;
}

function sobel(srcImg) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');

    var img_width = srcImg.width;
    var img_height = srcImg.height;

    var srcImgData = ctx.getImageData(0, 0, img_width, img_height);

    var x0 = img_width + 10, y0 = 0;
    var sobelImgData = ctx.getImageData(x0, y0, img_width, img_height);
    
    var tmpImage = imgPrepare(srcImgData);
    
    for(var x = 1; x < tmpImage.width - 1; x++) {
        for(var y = 1; y < tmpImage.height - 1; y++) {
            var p1 = get_rgba(x - 1, y - 1, tmpImage);
            var p2 = get_rgba(x, y - 1, tmpImage);
            var p3 = get_rgba(x + 1, y - 1, tmpImage);
            
            var p4 = get_rgba(x - 1, y, tmpImage);
            var p0 = get_rgba(x, y, tmpImage);
            var p5 = get_rgba(x + 1, y, tmpImage);
            
            var p6 = get_rgba(x - 1, y + 1, tmpImage);
            var p7 = get_rgba(x, y + 1, tmpImage);
            var p8 = get_rgba(x + 1, y + 1, tmpImage);
            
            var av_r_x = (
                -1*p1[0] + 1*p3[0] +
                -2*p4[0] + 2*p5[0] +
                -1*p6[0] + 1*p8[0]
            ) / 9;
            var av_g_x = (
                -1*p1[1] + 1*p3[1] +
                -2*p4[1] + 2*p5[1] +
                -1*p6[1] + 1*p8[1]
            ) / 9;
            var av_b_x = (
                -1*p1[2] + 1*p3[2] +
                -2*p4[2] + 2*p5[2] +
                -1*p6[2] + 1*p8[2]
            ) / 9;
            
            var av_r_y = (
                -1*p1[0] - 2*p2[0] - 1*p3[0] +
                 1*p6[0] + 2*p7[0] + 1*p8[0]
            ) / 9;
            var av_g_y = (
                -1*p1[1] - 2*p2[1] - 1*p3[1] +
                 1*p6[1] + 2*p7[1] + 1*p8[1]
            ) / 9;
            var av_b_y = (
                -1*p1[2] - 2*p2[2] - 1*p3[2] +
                 1*p6[2] + 2*p7[2] + 1*p8[2]
            ) / 9;
            
            var av_r = Math.sqrt(av_r_x * av_r_x + av_r_y * av_r_y);
            var av_g = Math.sqrt(av_g_x * av_g_x + av_g_y * av_g_y);
            var av_b = Math.sqrt(av_b_x * av_b_x + av_b_y * av_b_y);
            var av_a = 255;
            
            set_rgba(x - 1, y - 1, sobelImgData, [av_r, av_g, av_b, av_a]);
        }
}
    
    ctx.putImageData(sobelImgData, x0, y0);
}