/**
 * Created by wang on 2014/8/21.
 */

/**
 *
 * @说明 获取设备列表api
 * @api public
 * */
exports.getDeviceList = function (req, res) {
    var searchDeviceList=[];

    if (!req.body.pageIndex) {
        var error = 'Error:params pageIndex is not defined.';
        console.log(error);
        res.end(error);
        return;
    }
    else if (!req.body.pageSize) {
        var error = 'Error:params pageSize is not defined.';
        console.log(error);
        res.end(error);
        return;
    }

    var pageIndex = req.body.pageIndex;
    var pageSize = req.body.pageSize;


    var result = {success: true, totalCount: deviceList.length, data: searchDeviceList};

    res.send(result);
};