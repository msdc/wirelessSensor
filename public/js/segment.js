/**
 * Created by wang on 2014/9/16.
 */
$(function(){
    $('#btn_segment').click(function(){
        $('#segment_result').text('分词处理中...')
            .css({color:"red"});
        getSegmentResult();//分词
        gradeSplit();//极性划分
    });
});

function gradeSplit(){
    var newsContent=$('#news_content').val();
    var request = $.ajax({
        url: "/gradeSplit",
        type: "POST",
        data: { newsContent : newsContent }
    });
    request.done(gradeSplitHandler);
}

//发送ajax请求
function getSegmentResult(){
    var newsContent=$('#news_content').val();
    var request = $.ajax({
        url: "/newsSegment",
        type: "POST",
        data: { newsContent : newsContent }
    });
    request.done(segmentDataHandler);
}

//处理分词结果
function segmentDataHandler(data){
    var result=data;
    var resultString=' | ';
    for(var index in result){
       resultString=resultString+result[index].w+' | ';
    }
    $('#segment_result').text(resultString)
        .css({color:"blue"});
}

function gradeSplitHandler(data){
  alert(data);
}
