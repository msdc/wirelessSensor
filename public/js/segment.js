/**
 * Created by wang on 2014/9/16.
 */
$(function(){
    $('#btn_segment').click(function(){
        getSegmentResult();
    });
});

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
    alert(data);
}
