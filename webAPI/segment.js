/**
 * Created by wang on 2014/9/16.
 */
var easypost = require('easypost');
var Segment=require('segment').Segment;

exports.newsSegment=function(req,res){
    easypost.get(req, res, function (data) {
        var segment=new Segment();
        // 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
        segment.useDefault();
        var result=segment.doSegment(data.newsContent);

        res.send(result);
    });
};