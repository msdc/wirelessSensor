/**
 * Created by wang on 2014/9/3.
 */

$(function(){
    var btn_auto_deploy=$('#auto_deploy');
    var btn_data_init=$('#data_init');
    var btn_clear_calculated=$('#clear_calculated');

    btn_auto_deploy.click(function(){
        $.get('/init/deploy',function(data){
           if(data.success===true){
               showResult(successMsg);
           }else
           {
               showResult(errorMsg+data.message);
           }
        });
    });

    btn_data_init.click(function(){
        $.get('/init/dataInit',function(data){
           if(data.success===true){
               showResult(successMsg);
           }else
           {
               showResult(errorMsg+data.message);
           }
        });
    });

    btn_clear_calculated.click(function(){
        $.get('/init/clear_calculated',function(data){
            if(data.success===true){
                showResult(successMsg);
            }else
            {
                showResult(errorMsg+data.message);
            }
        });
    });
});

var successMsg="命令执行成功！";
var errorMsg="操作失败！错误信息：";

function showResult(msg){
    var resultDiv=$('#result');
    resultDiv.html(msg);
    setTimeout(function(){
        resultDiv.html('');
    },1500);
}