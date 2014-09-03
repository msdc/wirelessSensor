/**
 * Created by wang on 2014/9/3.
 */

$(function(){
    var btn_auto_deploy=$('#auto_deploy');
    var btn_data_init=$('#data_init');
    var resultDiv=$('#result');

    btn_auto_deploy.click(function(){
        $.get('/init/deploy',function(data){
           if(data.success===true){
               resultDiv.html("命令执行完成");
           }
        });
    });

    btn_data_init.click(function(){
        $.get('/init/dataInit',function(data){

        });
    });
});