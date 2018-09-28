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

function set_rgba(x, y, imgData, r, g, b, a) {
    var data = imgData.data;
    var imageWidth = imgData.width;
    
    data[((imageWidth * y) + x) * 4] = r;
    data[((imageWidth * y) + x) * 4 + 1] = g;
    data[((imageWidth * y) + x) * 4 + 2] = b;
    data[((imageWidth * y) + x) * 4 + 3] = a;
}

/*
123
405
678
*/

function blur(srcImg) {
    var canvas = document.getElementById('cvs');
    var ctx = canvas.getContext('2d');

    var img_width = srcImg.width;
    var img_height = srcImg.height;

    var srcImgData = ctx.getImageData(0, 0, img_width, img_height);

    var x0 = img_width + 10, y0 = 0;
    var blurImgData = ctx.getImageData(x0, y0, img_width, img_height);
    
    for(var x = 1; x < img_width - 1; x++) {
        for(var y = 1; y < img_height - 1; y++) {
            var p1 = get_rgba(x - 1, y - 1, srcImgData);
            var p2 = get_rgba(x, y - 1, srcImgData);
            var p3 = get_rgba(x + 1, y - 1, srcImgData);
            
            var p4 = get_rgba(x - 1, y, srcImgData);
            var p0 = get_rgba(x, y, srcImgData);
            var p5 = get_rgba(x + 1, y, srcImgData);
            
            var p6 = get_rgba(x - 1, y + 1, srcImgData);
            var p7 = get_rgba(x, y + 1, srcImgData);
            var p8 = get_rgba(x + 1, y + 1, srcImgData);
            
            var av_r = (p1[0] + p2[0] + p3[0] + p4[0] + p0[0] + p5[0] + p6[0] + p7[0] + p8[0]) / 9;
            var av_g = (p1[1] + p2[1] + p3[1] + p4[1] + p0[1] + p5[1] + p6[1] + p7[1] + p8[1]) / 9;
            var av_b = (p1[2] + p2[2] + p3[2] + p4[2] + p0[2] + p5[2] + p6[2] + p7[2] + p8[2]) / 9;
            var av_a = (p1[3] + p2[3] + p3[3] + p4[3] + p0[3] + p5[3] + p6[3] + p7[3] + p8[3]) / 9;
            
            set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
        }
    }
    
/*
405
678
*/
    
    for(var x = 1, y = 0; x < img_width - 1; x++) {
        var p4 = get_rgba(x - 1, y, srcImgData);
        var p0 = get_rgba(x, y, srcImgData);
        var p5 = get_rgba(x + 1, y, srcImgData);

        var p6 = get_rgba(x - 1, y + 1, srcImgData);
        var p7 = get_rgba(x, y + 1, srcImgData);
        var p8 = get_rgba(x + 1, y + 1, srcImgData);

        var av_r = (p4[0] + p0[0] + p5[0] + p6[0] + p7[0] + p8[0]) / 6;
        var av_g = (p4[1] + p0[1] + p5[1] + p6[1] + p7[1] + p8[1]) / 6;
        var av_b = (p4[2] + p0[2] + p5[2] + p6[2] + p7[2] + p8[2]) / 6;
        var av_a = (p4[3] + p0[3] + p5[3] + p6[3] + p7[3] + p8[3]) / 6;

        set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    }
    
/*
123
405
*/
    
    for(var x = 1, y = img_height - 1; x < img_width - 1; x++) {
        var p1 = get_rgba(x - 1, y - 1, srcImgData);
        var p2 = get_rgba(x, y - 1, srcImgData);
        var p3 = get_rgba(x + 1, y - 1, srcImgData);
        
        var p4 = get_rgba(x - 1, y, srcImgData);
        var p0 = get_rgba(x, y, srcImgData);
        var p5 = get_rgba(x + 1, y, srcImgData);

        var av_r = (p1[0] + p2[0] + p3[0] + p4[0] + p0[0] + p5[0]) / 6;
        var av_g = (p1[1] + p2[1] + p3[1] + p4[1] + p0[1] + p5[1]) / 6;
        var av_b = (p1[2] + p2[2] + p3[2] + p4[2] + p0[2] + p5[2]) / 6;
        var av_a = (p1[3] + p2[3] + p3[3] + p4[3] + p0[3] + p5[3]) / 6;

        set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    }
    
/*
12
40
67
*/
    
    for(var y = 1, x = 0; y < img_height - 1; y++) {
        var p1 = get_rgba(x - 1, y - 1, srcImgData);
        var p2 = get_rgba(x, y - 1, srcImgData);

        var p4 = get_rgba(x - 1, y, srcImgData);
        var p0 = get_rgba(x, y, srcImgData);

        var p6 = get_rgba(x - 1, y + 1, srcImgData);
        var p7 = get_rgba(x, y + 1, srcImgData);

        var av_r = (p1[0] + p2[0] + p4[0] + p0[0] + p6[0] + p7[0]) / 6;
        var av_g = (p1[1] + p2[1] + p4[1] + p0[1] + p6[1] + p7[1]) / 6;
        var av_b = (p1[2] + p2[2] + p4[2] + p0[2] + p6[2] + p7[2]) / 6;
        var av_a = (p1[3] + p2[3] + p4[3] + p0[3] + p6[3] + p7[3]) / 6;

        set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    }
    
/*
23
05
78
*/
    
    for(var y = 1, x = img_width - 1; y < img_height - 1; y++) {
        var p2 = get_rgba(x, y - 1, srcImgData);
        var p3 = get_rgba(x + 1, y - 1, srcImgData);

        var p0 = get_rgba(x, y, srcImgData);
        var p5 = get_rgba(x + 1, y, srcImgData);

        var p7 = get_rgba(x, y + 1, srcImgData);
        var p8 = get_rgba(x + 1, y + 1, srcImgData);

        var av_r = (p2[0] + p3[0] + p0[0] + p5[0] + p7[0] + p8[0]) / 6;
        var av_g = (p2[1] + p3[1] + p0[1] + p5[1] + p7[1] + p8[1]) / 6;
        var av_b = (p2[2] + p3[2] + p0[2] + p5[2] + p7[2] + p8[2]) / 6;
        var av_a = (p2[3] + p3[3] + p0[3] + p5[3] + p7[3] + p8[3]) / 6;

        set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    }
    
/*
12
40
*/
    var x = img_width - 1, y = img_height - 1;
    var p1, p2, p3, p4, p0, p5, p6, p7, p8;
    var av_r, av_g, av_b, av_a;
    
    p1 = get_rgba(x - 1, y - 1, srcImgData);
    p2 = get_rgba(x, y - 1, srcImgData);

    p4 = get_rgba(x - 1, y, srcImgData);
    p0 = get_rgba(x, y, srcImgData);
    
    av_r = (p1[0] + p2[0] + p4[0] + p0[0]) / 4;
    av_g = (p1[1] + p2[1] + p4[1] + p0[1]) / 4;
    av_b = (p1[2] + p2[2] + p4[2] + p0[2]) / 4;
    av_a = (p1[3] + p2[3] + p4[3] + p0[3]) / 4;

    set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    
/*
23
05
*/
    x = 0;
    p2 = get_rgba(x, y - 1, srcImgData);
    p3 = get_rgba(x + 1, y - 1, srcImgData);

    p0 = get_rgba(x, y, srcImgData);
    p5 = get_rgba(x + 1, y, srcImgData);
    
    av_r = (p2[0] + p3[0] + p0[0] + p5[0]) / 4;
    av_g = (p2[1] + p3[1] + p0[1] + p5[1]) / 4;
    av_b = (p2[2] + p3[2] + p0[2] + p5[2]) / 4;
    av_a = (p2[3] + p3[3] + p0[3] + p5[3]) / 4;

    set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    
/*
40
67
*/
    x = img_width - 1; y = 0;
    p4 = get_rgba(x - 1, y, srcImgData);
    p0 = get_rgba(x, y, srcImgData);

    p6 = get_rgba(x - 1, y + 1, srcImgData);
    p7 = get_rgba(x, y + 1, srcImgData);
    
    av_r = (p4[0] + p0[0] + p6[0] + p7[0]) / 4;
    av_g = (p4[1] + p0[1] + p6[1] + p7[1]) / 4;
    av_b = (p4[2] + p0[2] + p6[2] + p7[2]) / 4;
    av_a = (p4[3] + p0[3] + p6[3] + p7[3]) / 4;

    set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    
/*
05
78
*/
    x = 0;
    p0 = get_rgba(x, y, srcImgData);
    p5 = get_rgba(x + 1, y, srcImgData);

    p7 = get_rgba(x, y + 1, srcImgData);
    p8 = get_rgba(x + 1, y + 1, srcImgData);
    
    av_r = (p0[0] + p5[0] + p7[0] + p8[0]) / 4;
    av_g = (p0[1] + p5[1] + p7[1] + p8[1]) / 4;
    av_b = (p0[2] + p5[2] + p7[2] + p8[2]) / 4;
    av_a = (p0[3] + p5[3] + p7[3] + p8[3]) / 4;

    set_rgba(x, y, blurImgData, av_r, av_g, av_b, av_a);
    
    ctx.putImageData(blurImgData, x0, y0);
}
