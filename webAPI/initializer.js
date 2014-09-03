/**
 * Created by wang on 2014/9/3.
 */

var spawn=require('child_process').spawn;
exports.webDeploy=function(req,res){
    var linuxShell=spawn("/www/wls/restartnodejs");
    linuxShell.on('close',function(code){
        res.send({success:true});
        res.end();
    });
};

exports.dataInit=function(req,res){

};
