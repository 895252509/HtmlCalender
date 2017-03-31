
var ZxCalendar = (function (){
    var _year = new Date().getFullYear();
    var _renderID = 'MyCalendar';
    var _weekName= ['日','一','二','三','四','五','六'];
    var _monthName = ['一','二','三','四','五','六','七','八','九','十','十一','十二'];
    var _divWidth = 800;
    var _divHeight = 1000;
    var _paddingTB = null;
    var _paddingRL = null;
    var _colSpace = 100;
    var _rowSpace = 100;
    var _title = _year+'年日历';
    var _colNumber= 3;
    var _rowNumber =Math.ceil( 12 / _colNumber ) ;
    var _mTableCol = _colNumber*2+1;
    var _monthTableWidth = (_divWidth - 2*_paddingRL )/_colNumber;
    var _monthTableHeight = (_divHeight - 2*_paddingTB )/Math.ceil( 12/_colNumber );
    var _fontSize = 11;
    var _monthTablePadding = 2;
    var _mdiv = document.getElementById(_renderID);
    
    var _titleFontColor = 'Black';
    var _titleFontSize = 16;
    var _titleBgColor = 'White';
    
    var _cBgColor = 'White';
    var _frontColor = 'skyblue';
    var _MonthNameBgColor = 'White';
    var _MonthNameFontColor = 'Black';
    var _MonthTitleBgColor = 'White';
    var _MonthTitleFontColor = 'Black';
    
    function forDiv(id,year,arr){debugger;
        //初始化数据
        _year = year || _year;
        _renderID = id || _renderID;
        doLayout();
        
        var dayList = decodeDay(arr);
        var dayList = dayList[_year.toString()];
                                 
        var mtable = document.createElement('table');
        mtable.setAttribute("cellpadding","0");
        mtable.setAttribute("cellspacing","0");
        var mtableStyle =(mtable.getAttribute("style")||"")+"height:"+_divHeight+"px;width:"+_divWidth+"px;"+"padding:0px;margin:0px;border:2px solid skyblue;";
        mtable.setAttribute("style",mtableStyle);
        var mthead = document.createElement('thead');
        var mtbody = document.createElement('tbody');
        var mtitle = createFONT(_title,_titleFontColor,_titleFontSize); 
        var titleTd = createTD(_mTableCol);
        var titleTdStyle = titleTd.getAttribute("style") || "";
        titleTdStyle += "height:"+(_titleFontSize+4).toString()+"px;"
        titleTd.setAttribute("style",titleTdStyle);
        titleTd.appendChild(mtitle);
        mthead.appendChild(titleTd);
        mtable.appendChild(mthead);
        
        var rowNumber = Math.ceil( 12/_colNumber );
        for(var row=0;row<rowNumber;row++){
            var padding = createTr();
            var td = createTD(_mTableCol);
            var tdStyle = (td.getAttribute("style")||"")+"height:"+_rowSpace+"px;";
            td.setAttribute("style",tdStyle);
            padding.appendChild(td);
            mtbody.appendChild(padding);
            
            var rowTable = createTr();
            for(var col= 0; col < _colNumber;col++){
                var thisMonth = row*_colNumber+col;
                var padding_left = document.createElement('td');
                tdStyle = (padding_left.getAttribute("style")||"")+"width:"+_colSpace+"px;";
                padding_left.setAttribute("style",tdStyle);
                rowTable.appendChild(padding_left);
                var monthTD = createTD();
                monthTD.appendChild(createMonth(thisMonth,dayList[transNumber(thisMonth+1)]));
                rowTable.appendChild(monthTD);
            }
            var padding_right = document.createElement('td');
            tdStyle = (padding_right.getAttribute("style")||"")+"width:"+_colSpace+"px;";
            padding_right.setAttribute("style",tdStyle);
            rowTable.appendChild(padding_right);
            mtbody.appendChild(rowTable);
        }
        var padding_bottom = createTr();
        td = createTD(_mTableCol);
        padding_bottom.appendChild(td);
        mtbody.appendChild(padding_bottom);
        mtable.appendChild(mtbody);
        _mdiv.appendChild(mtable);
    }
    
    function decodeDay(arr){
        if(typeof arr === 'undefined' || !(arr instanceof Array))
            throw new Error('Parameter Type Error');
        var te= new RegExp (/[012][0-9]{3}\/[012][0-9]\/[0123][0-9]/);
        var result={};
        for(var i=0;i<arr.length;i++){
            if(!te.test(arr[i])) continue;
            var d = arr[i].split('/');
            var tmp=result;
            for(var j=0;j<d.length;j++){
                if( tmp[d[j]] ){
                    tmp= tmp[d[j]];
                }else{
                    tmp[d[j]] = {};
                    tmp= tmp[d[j]];
                }
            }
        }
        return result;
    }
    
    function createMonth(month,dayList){
        var thedayList = dayList || {};
        var _month = typeof month === 'undefined'?0 : month;
        //承载月份的表格
        var monthTable = document.createElement('table');
        monthTable.setAttribute("cellpadding","0");
        monthTable.setAttribute("cellspacing","0");
        var mtableStyle =(monthTable.getAttribute("style")||"")+"height:"+_monthTableHeight+"px;width:"+_monthTableWidth+"px;padding:"+_monthTablePadding+"px;"
        monthTable.setAttribute("style",mtableStyle);
        //创建一个表头用来显示月份
        var monthHead = document.createElement('thead');
        //创建一个tbody , 显示日期
        var monthBody = document.createElement('tbody');
        monthBody.appendChild(createWeekTitle());
        //
        var date = new Date(_year,month,1);
        
        //构建月table对象
        var titlefont = createFONT(_monthName[month]+'月',_MonthNameFontColor,_fontSize);
        var titletd = createTD(7);
        titletd.appendChild(titlefont);
        titletd.setAttribute("style","width:100%;text-align:center;background-color:"+_MonthNameBgColor+";");
        var itr = createTr();
        itr.appendChild(titletd);
        monthHead.appendChild(itr);
        monthTable.appendChild(monthHead);
        
        //保存每周的tr
        var monthTrWeek = createTr();
        //标志位，用来测试是否进入下月
        var monthFlag = _month;
        //记录天再tr中的索引
        var dayOnWeek= 0;
        var dayOnMonth = 0;
        while(monthFlag === _month){
            var theday={};
            dayOnWeek = date.getDay();
            dayOnMonth = date.getDate();
            if(thedayList[transNumber( dayOnMonth)])
                theday = createDay(dayOnMonth,null,_frontColor);
            else
                theday = createDay(dayOnMonth,null,null);
            if(date.getDate() === 1){
                if(dayOnWeek!=0){
                    var space = createTD(dayOnWeek);
                    monthTrWeek.appendChild(space); 
                }
            }
            if(dayOnWeek === 6){
                monthTrWeek.appendChild(theday);
                monthBody.appendChild(monthTrWeek);
                monthTrWeek = createTr();
            }else{
                monthTrWeek.appendChild(theday);
            }
            
            date.setDate(date.getDate()+1);
            monthFlag = date.getMonth();
        }
        if(date.getDay() != 0)
            monthBody.appendChild(monthTrWeek);
        var weekN = monthBody.childNodes.length;
        if(weekN === 6){
            space = createTD(7);
            monthTrWeek = createTr();
            monthTrWeek.appendChild(space);
            monthTrWeek.setAttribute("style","height:20px;");
            monthBody.appendChild(monthTrWeek);
        }
        
        monthTable.appendChild(monthBody);
        return monthTable;
    }
    /*doLayout 使用set函数设置样式后 重新计算日历显示参数
    */
    function doLayout(){
        _mTableCol = _colNumber*2+1;
        _mdiv = document.getElementById(_renderID);
        _mdiv.innerHTML = '';
        var mdivStyle = _mdiv.getAttribute("style")+"overflow:hidden;";
        //_mdiv.setAttribute("style",mdivStyle);
        _divHeight= _mdiv.clientHeight;
        _divWidth= _mdiv.clientWidth;
        _paddingRL =Math.round( _paddingRL || _divWidth * 0.04);
        var monthTableMinWidth =Math.round( (_fontSize + 2) * 7 + _monthTablePadding);
        var monthTableMaxWidth =Math.round( (_fontSize * 2) * 7 + _monthTablePadding);
        if(monthTableMinWidth*_colNumber > _divWidth){
            _colSpace = 1;
            _paddingRL = 2;
            _monthTableWidth = monthTableMinWidth;
        }
        else if(monthTableMaxWidth* _colNumber+_paddingRL*2 < _divWidth){
            if(_colNumber === 1)
                _colSpace = _paddingRL = Math.round( (_divWidth- monthTableMaxWidth*_colNumber) / (_colNumber+ 1) );
            else
                _colSpace =Math.round( ( (_divWidth - monthTableMaxWidth* _colNumber)- _paddingRL*2 ) / (_colNumber - 1) );
            _monthTableWidth = monthTableMaxWidth;
        }else {
            _colSpace= _paddingRL= Math.round( (_divWidth- monthTableMaxWidth*_colNumber - (_titleFontSize+4)) / (_colNumber+ 1) );
            _monthTableWidth = monthTableMaxWidth;
        }
        
        _paddingTB =Math.round( _paddingTB || _divHeight * 0.04);
        var monthTableMinHeight =Math.round( (_fontSize + 2) * 7 + _monthTablePadding);
        var monthTableMaxHeight =Math.round( (_fontSize * 2) * 7 + _monthTablePadding);
        if(monthTableMinHeight*_rowNumber > _divHeight){
            _rowSpace = 1;
            _paddingTB = 2;
            _monthTableHeight = monthTableMinHeight;
        }
        else if(monthTableMaxHeight* _rowNumber+_paddingTB*2 < _divHeight){
            if(_rowNumber === 1)
                _rowSpace = _paddingTB = Math.round( (_divHeight- monthTableMaxHeight*_rowNumber) / (_rowNumber+ 1) );
            else
                _rowSpace =Math.round( ( (_divHeight - monthTableMaxHeight* _rowNumber)- _paddingTB*2 ) / (_rowNumber + 1) );
            _monthTableHeight = monthTableMaxHeight;
        }else {
            _rowSpace= _paddingTB= Math.round( (_divHeight- monthTableMaxHeight*_rowNumber) / (_rowNumber+ 1) );
            _monthTableHeight = monthTableMaxHeight;
        }
        
        
        
    }
    function transNumber(a){
        if( a/10 <1)
            return '0'+a.toString();
        else
            return a.toString();
    }
    /*
    
    */
    function createTr(){
        var tr= document.createElement('tr');
        tr.setAttribute('style','width:100%;');
        return tr;
    }
    function createWeekTitle(){
        var tr= createTr();
        for(var i=0;i<_weekName.length;i++){
            var titleday = createDay(_weekName[i],_MonthTitleFontColor,_MonthTitleBgColor);
            tr.appendChild(titleday);
        }
        return tr;
    }
    
    /*创建一个day 单元格
        param: day-单元格内显示的字
        param: fontColor 字体颜色
        param: gbColor 背景颜色
    
    */    
    function createDay(day,fontColor,bgColor){
        
        var thefontColor = fontColor || 'Black';
        var thebgColor =  bgColor || 'White';
        //判断日期 day的 格式是否正确
        // 日历的标题  ‘日’ ‘一’ ‘六’ 等都由此创建
        var td = createTD(1);
        var font = createFONT(day,thefontColor,_fontSize);
        td.appendChild(font);
        var tdstyle =(td.getAttribute("style")||"")+"width:"+(_fontSize+2)+"px;background-color:"+ thebgColor+";";
        td.setAttribute("style",tdstyle);
        return td;
    }
    //创建一个td dom对象，参数是合并列的个数
    //如果不传入参数，那么默认合并为0
    function createTD(colspan){
        var thecolspan = colspan || 1;
        var td = document.createElement('td');
        td.setAttribute("colspan",thecolspan);
        var tdstyle =(td.getAttribute("style")||"")+"text-align:center;padding:0px;margin:0px;"
        td.setAttribute("style",tdstyle);
        return td;
    }
    
    //返回一个字符串，以<font>标签包裹的日期
    function createFONT(day,fontColor,fonSize){
        
        var thefontColor = fontColor || 'Black';
        var thefontSize = fonSize || 10 ;
        var font = document.createElement('font');
        var theStyle = font.getAttribute("style") || "";
        theStyle+= "font-size:"+thefontSize+"px;font-family:Microsoft YaHei,Georgia,Serif;";
        font.setAttribute("color",thefontColor);
        font.setAttribute("style",theStyle);
        font.innerHTML = day;
        return font;
    }
    
    return {
        forDiv : forDiv
        
    }
    
})();