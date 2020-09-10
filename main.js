(function() {
    'use strict';
    var cv_width = 550;
    var prev = {
        x: 0,
        y: 0
    };
    function draw(e){
        var x = e.offsetX,
            y = e.offsetY;
        var size = inputPenSize();
        if(e.which){
            var ctx = this.getContext('2d');
            var ctx_master = cv_master.get(0).getContext('2d');
            if(e.buttons === 2) ctx = ctx_master;
            ctx_master.globalCompositeOperation = e.buttons === 2 ? 'destination-out' : 'source-over';
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(x,y);
            ctx.lineWidth = size;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
        }
        prev.x = x;
        prev.y = y;
    }
    function setCSSfilter(){
        var rgb = yaju1919.getRGB(jqInputColor.val());
        cv.css({
            filter: new Solver(new Color(rgb[0], rgb[1], rgb[2])).solve().filter + ` opacity(${inputColorAlpha()*100}%)`
        });
    }
    function commitCanvas(){
        var ctx = cv.get(0).getContext('2d');
        var imageData = ctx.getImageData(0, 0, cv.width(), cv.height());
        var data = imageData.data;
        var rgb = yaju1919.getRGB(jqInputColor.val());
        var a = inputColorAlpha() * 255;
        for (var i = 0; i < data.length; i += 4) {
            if(data[i + 3] === 0) continue;
            data[i] = rgb[0];
            data[i + 1] = rgb[1];
            data[i + 2] = rgb[2];
            data[i + 3] = a;
        }
        ctx.putImageData(imageData, 0, 0);
        cv_master.get(0).getContext('2d').drawImage(cv.get(0),0,0);
        ctx.clearRect(0, 0, cv.width(), cv.height());
    }
    function addBtn(h,title,func){
        $("<button>").appendTo(h).text(title).click(func);
    }
    var h = $("<div>").attr({
        onselectstart: "return false"
    }).css({
        "text-align": "center",
        padding: "1em",
    }).appendTo($("body").css({
        backgroundColor: "lightblue"
    }));
    $("<h1>").appendTo(h).text("お絵かきツール");
    $("<div>").appendTo(h).text("右クリックで消しゴム");
    var h_cv = $("<div>").appendTo(h).css({
        display: "inline-block",
        position: "relative",
        backgroundColor: "white",
        width: cv_width,
        height: cv_width,
    });
    var cv_master = $("<canvas>").appendTo(h_cv).css({
        position: "absolute",
        top: 0,
        left: 0,
    }).attr({
        width: cv_width,
        height: cv_width
    });
    var cv = $("<canvas>").appendTo(h_cv).css({
        position: "absolute",
        top: 0,
        left: 0,
    }).attr({
        width: cv_width,
        height: cv_width
    }).bind("contextmenu",function(e){
        return false;
    }).on("mousedown",draw).on("mousemove",draw);
    $(window).on("mouseup",commitCanvas);
    //--------------------------------------------------------------------------------------------------
    var h_ui = $("<div>").appendTo(h).css({
        backgroundColor: "white",
    });
    var inputPenSize = yaju1919.addInputRange(h_ui,{
        title: "ペンの太さ",
        min: 1,
        max: 30,
        step: 1,
        value: 5,
        save: "ペンの太さ"
    });
    var jqInputColor = $("<input>").appendTo($("<div>").appendTo(h_ui).text("色：")).attr({
        type: "color"
    }).on("change",setCSSfilter);
    var inputColorAlpha = yaju1919.addInputRange(h_ui,{
        title: "不透明度",
        min: 0,
        max: 1,
        step: 0.01,
        value: 1,
        save: "不透明度",
        change: setCSSfilter
    });
    addBtn(h_ui,"全消し",function(){
        cv_master.get(0).getContext('2d').clearRect(0, 0, cv.width(), cv.height());
    });
    addBtn(h_ui,"保存",function(){
        $("<a>").attr({
            href: cv_master.get(0).toDataURL(),
            download: "イラスト.png"
        }).get(0).click();
    });
    h_ui.children().each((i,e)=>$(e).add("<br>"));
})();
