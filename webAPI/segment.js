/**
 * Created by wang on 2014/9/16.
 */
var easypost = require('easypost');
var Segment=require('segment').Segment;
var fs = require('fs');
var path = require('path');
var segment=new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

//分词处理
exports.newsSegment=function(req,res){
    easypost.get(req, res, function (data) {
        var segmentWords=segment.doSegment(data.newsContent);
        res.send(segmentWords);
    });
};

exports.gradeSplit=function(req,res){
    easypost.get(req, res, function (data) {
        var segmentWords=segment.doSegment(data.newsContent);
        res.send(gradeSplit(segmentWords));
    });
};

//极性划分
function gradeSplit(words){
    var splitResult={};
    var filename = path.resolve("webAPI", "dict/", "./grade.txt");
    var totalScore=0;//总分
    var positiveScore=0;//正得分
    var negativeScore=0;//负得分
    var positiveWords=[];//正情感词集合
    var positiveWordsCount=0;//正得分单词数
    var negativeWordsCount=0;//负得分单词数
    var negativeWords=[];//负情感词集合
    var noScoreWordsCount=0;//没有情感倾向词个数

    if (!fs.existsSync(filename)) {
        throw Error('Cannot find dict file "' + filename + '".');

    } else {
        var data = fs.readFileSync(filename, 'utf8');
        data = data.split(/\r?\n/);

        words.forEach(function(word,wordIndex){
            data.forEach(function (line,dictIndex) {
                var blocks = line.split('\t');
                if (blocks.length > 2) {
                    var w1=blocks[0].trim();
                    var w2=blocks[1].trim();
                    var grade=Number(blocks[2]);

                    if((word.w.indexOf(w1)>-1)||(word.w.indexOf(w2)>-1)){//有情感词
                        if(grade>0){//正得分
                            positiveScore=positiveScore+grade;//正得分
                            positiveWords.push(word.w);//正得分集合
                            positiveWordsCount++;//正得分数量
                        }else{
                            negativeScore=negativeScore+grade;//负得分
                            negativeWords.push(word.w);//负得分集合
                            negativeWordsCount++;//负得分数量
                        }
                    }else{//无情感词
                        noScoreWordsCount++;
                    }

                    if(dictIndex==(data.length-1)){
                        if(wordIndex==(words.length-1)){
                            //总得分
                            totalScore=positiveScore+negativeScore;

                            splitResult.positiveScore=positiveScore;
                            splitResult.positiveWords=positiveWords;
                            splitResult.positiveWordsCount=positiveWordsCount;
                            splitResult.negativeScore=negativeScore;
                            splitResult.negativeWords=negativeWords;
                            splitResult.negativeWordsCount=negativeWordsCount;
                            splitResult.totalScore=totalScore;

                            return splitResult;
                        }
                    }

                }
            });
        });
    }
};

