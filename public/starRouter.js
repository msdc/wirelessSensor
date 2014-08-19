/**矩阵（2维数组） +中间路径***/

var closelist=[],openlist=[];
var gw=10,gh=10,gwh=14;
var p_start=new Array(2),p_end=new Array(2);
var s_path,n_path="";
var num,bg,flag=0;
var w=30,h=20;//行总数30，列总数20
function GetRound(pos){
    var a=[];
    a[0]=(pos[0]+1)+","+(pos[1]-1);
    a[1]=(pos[0]+1)+","+pos[1];
    a[2]=(pos[0]+1)+","+(pos[1]+1);
    a[3]=pos[0]+","+(pos[1]+1);
    a[4]=(pos[0]-1)+","+(pos[1]+1);
    a[5]=(pos[0]-1)+","+pos[1];
    a[6]=(pos[0]-1)+","+(pos[1]-1);
    a[7]=pos[0]+","+(pos[1]-1);
    console.log('2维数组:',a);
    return a;
}
function GetF(arr){
    var t,G,H,F;
    for(var i=0;i<arr.length;i++){
        t=arr[i].split(",");
        t[0]=parseInt(t[0]);t[1]=parseInt(t[1]);
        if(IsOutScreen([t[0],t[1]])||IsPass(arr[i])||InClose([t[0],t[1]])||IsStart([t[0],t[1]])||!IsInTurn([t[0],t[1]]))
            continue;
        if((t[0]-s_path[3][0])*(t[1]-s_path[3][1])!=0)
            G=s_path[1]+gwh;
        else
            G=s_path[1]+gw;
        if(InOpen([t[0],t[1]])){
            if(G<openlist[num][1]){
                openlist[num][0]=(G+openlist[num][2]);
                openlist[num][1]=G;
                openlist[num][4]=s_path[3];
            }
            else{G=openlist[num][1];}
        }
        else{
            H=(Math.abs(p_end[0]-t[0])+Math.abs(p_end[1]-t[1]))*gw;
            F=G+H;
            arr[i]=new Array();
            arr[i][0]=F;arr[i][1]=G;arr[i][2]=H;arr[i][3]=[t[0],t[1]];arr[i][4]=s_path[3];
            openlist[openlist.length]=arr[i];
        }
        if(maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#cccccc"&&maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#0000ff"&&maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#ff0000"&&maptt.rows[t[1]].cells[t[0]].style.backgroundColor!="#00ff00")
        {
            maptt.rows[t[1]].cells[t[0]].style.backgroundColor="#FF00FF";
        }
    }
}
function IsStart(arr){
    if(arr[0]==p_start[0]&&arr[1]==p_start[1])
        return true;
    return false;
}
function IsInTurn(arr){
    if(arr[0]>s_path[3][0]){
        if(arr[1]>s_path[3][1]){
            if(IsPass((arr[0]-1)+","+arr[1])||IsPass(arr[0]+","+(arr[1]-1)))
                return false;
        }
        else if(arr[1]<s_path[3][1]){
            if(IsPass((arr[0]-1)+","+arr[1])||IsPass(arr[0]+","+(arr[1]+1)))
                return false;
        }
    }
    else if(arr[0]<s_path[3][0]){
        if(arr[1]>s_path[3][1]){
            if(IsPass((arr[0]+1)+","+arr[1])||IsPass(arr[0]+","+(arr[1]-1)))
                return false;
        }
        else if(arr[1]<s_path[3][1]){
            if(IsPass((arr[0]+1)+","+arr[1])||IsPass(arr[0]+","+(arr[1]+1)))
                return false;
        }
    }
    return true;
}
function IsOutScreen(arr){
    if(arr[0]<0||arr[1]<0||arr[0]>(w-1)||arr[1]>(h-1)){
        return true;
    }
    return false;
}
function InOpen(arr){
    var bool=false;
    for(var i=0;i<openlist.length;i++){
        if(arr[0]==openlist[i][3][0]&&arr[1]==openlist[i][3][1]){
            bool=true;num=i;break;}
    }
    return bool;
}
function InClose(arr){
    var bool=false;
    for(var i=0;i<closelist.length;i++){
        if((arr[0]==closelist[i][3][0])&&(arr[1]==closelist[i][3][1])){
            bool=true;break;}
    }
    return bool;
}
function IsPass(pos){
    if((";"+n_path+";").indexOf(";"+pos+";")!=-1)
        return true;
    return false;
}
function Sort(arr){
    var temp;
    for(var i=0;i<arr.length;i++){
        if(arr.length==1)break;
        if(arr[i][0]<=arr[i+1][0]){
            temp=arr[i];
            arr[i]=arr[i+1];
            arr[i+1]=temp;
        }
        if((i+1)==(arr.length-1))
            break;
    }
}
function main(){
    GetF(GetRound(s_path[3]));
    Sort(openlist);
    s_path=openlist[openlist.length-1];
    closelist[closelist.length]=s_path;
    openlist[openlist.length-1]=null;
    if(openlist.length==0){alert("找不到路径");return;}
    openlist.length=openlist.length-1;
    if((s_path[3][0]==p_end[0])&&(s_path[3][1]==p_end[1])){
        getPath();
    }
    else{
        maptt.rows[s_path[3][1]].cells[s_path[3][0]].style.backgroundColor="#00ff00";
        setTimeout("main()",100);
    }
}
function getPath(){
    var str="";
    var t=closelist[closelist.length-1][4];
    while(1){
        str+=t.join(",")+";";
        maptt.rows[t[1]].cells[t[0]].style.backgroundColor="#ffff00";
        for(var i=0;i<closelist.length;i++){
            if(closelist[i][3][0]==t[0]&&closelist[i][3][1]==t[1])
                t=closelist[i][4];
        }
        if(t[0]==p_start[0]&&t[1]==p_start[1])
            break;
    }
    alert(str);
    console.log('路径：',str)
}
function setPos(){
    var h=(Math.abs(p_end[0]-p_start[0])+Math.abs(p_end[1]-p_start[1]))*gw;
    s_path=[h,0,h,p_start,p_start];
}
function set(id,arr){
    switch(id){
        case 1://一个起点
            p_start=arr;
            $('#maptt td').removeClass('mStart');
            maptt.rows[arr[1]].cells[arr[0]].style.backgroundColor="#ff0000";//竟然根据颜色进行查证。需要修改。。
            maptt.rows[arr[1]].cells[arr[0]].className='mStart';
            break;
        case 2://一个终点
            $('#maptt td').removeClass('mEnd');
            p_end=arr;maptt.rows[arr[1]].cells[arr[0]].style.backgroundColor="#0000ff";
            maptt.rows[arr[1]].cells[arr[0]].className='mEnd';
            break;
        case 3://多个障碍
            n_path+=arr.join(",")+";";maptt.rows[arr[1]].cells[arr[0]].style.backgroundColor="#cccccc";break;
        default:
            break;
    }
}
function setflag(id){
    flag=id;
}


$(function(){//代码需优化


    var str='';
    for(var i=0;i<h;i++){
        str+='<tr>';
        for(var j=0;j<w;j++){
            str+=('<td onclick="set(flag,['+j+','+i+']);"></td>');
        }
        str+='</tr>';
    }
    $('#maptt').html(str);//生成网格


    $('.cS1').click(function(){//设置起点
        setflag(1);
    })
    $('.cS2').click(function(){//设置终点
        setflag(2);
    })
    $('.cS3').click(function(){//设置障碍物
        setflag(3);
    })
    $('#searchLJ').click(function(){//开始查找。。。
        //需要判断是否已经点了起点 终点
        setPos();
        main();
        $(this).attr('disabled',true);
    })
})