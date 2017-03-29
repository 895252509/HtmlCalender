
var ZxCalender = (function (){
    function forDIV(id,year){
        //取参数，设置默认值
        var _renderID = id || 'MyCalender';
        var date = new Date();
        var _year = year || date.getFullYear();
        
        debugger;
        
        var font=createDay(1,'Red','Blue');
        
        document.getElementById('main').appendChild(font);
    }
    
    function createMonth(month){
        var _month = month || 1;
        //承载月份的表格
        var monthTable = document.createElement('table');
        //创建一个表头用来显示月份
        var monthHead = document.createElement('thead');
        //创建一个tbody , 显示日期
        var monthBody = document.createElement('tbody');
        //
        var date = new Date(_year,month,1);
        //
        var monthTrWeek = document.createElement('tr');
        //标志位，用来测试是否进入下月
        var monthFlag = _month;
        while(monthFlag === _month){
            
            
            
            
            
            date.setDate(date.getDate()+1);
            monthFlag = date.getMonth();
        }
    }
    /*
    
    */
    function createTr(){
        var tr= document.createElement('tr');
        tr.setAttribute('style','width:100%;');
        return tr;
    }
    
    /*创建一个day 单元格
        param: day-单元格内显示的字
        param: fontColor 字体颜色
        param: gbColor 背景颜色
    
    */    
    function createDay(day,fontColor,bgColor){
        
        var thefontColor = fontColor;
        var thebgColor = typeof bgColor === 'undefined'||bgColor === null? 'White'  : bgColor;
        //判断日期 day的 格式是否正确
        // 日历的标题  ‘日’ ‘一’ ‘六’ 等都由此创建
        var td = createTD(1);
        var font = createFONT(day,thefontColor);
        td.appendChild(font);
        var tdstyle = "width:14%;text-align:center;background-color:"+ bgColor+";";
        td.setAttribute("style",tdstyle);
        return td;
    }
    //创建一个td dom对象，参数是合并列的个数
    //如果不传入参数，那么默认合并为0
    function createTD(colspan){
        var thecolspan = colspan || 0;
        var td = document.createElement('td');
        td.setAttribute("colspan",thecolspan);
        return td;
    }
    
    //返回一个字符串，以<font>标签包裹的日期
    function createFONT(day,fontColor){
        
        var thefontColor = fontColor;
        var font = document.createElement('font');
        font.setAttribute("color",fontColor);
        font.innerHTML = day;
        return font;
    }
    
    return {
        forDIV : forDIV
        
    }
    
})();