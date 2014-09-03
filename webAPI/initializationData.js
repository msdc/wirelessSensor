/**
 * Created by lenovo on 2014/9/3.
 */
exports.place={
    "Id": 1,
    "name": "西单大悦城",
    "desc": "西单大悦城",
    "position": {
        "lat": 23.1231233,
        "lng": 34.2312323
    },
    "descImages": [
        {
            "id": 1,
            "url": "/images/palceinfor_pic1.jpg"
        },
        {
            "id": 2,
            "url": "/images/palceinfor_pic2.jpg"
        },
        {
            "id": 3,
            "url": "/images/palceinfor_pic3.jpg"
        }
    ],
    "maps": [
        {
            "id": 1,
            "name": "一楼",
            "url": "/images/placemap_pic.png",
            "matrixID": "place_floor_matrix",
            "matrixSize": {
                "x": 800,
                "y": 900
            },
            "imageSize": {
                "width": 0,
                "height": 0
            },
            "canvasSize": {
                "width": 22,
                "height": 0
            },
            "scale": "1:10000"
        },
        {
            "id": 2,
            "matrixID": "place_floor_matrix",
            "matrixSize": {
                "x": 800,
                "y": 900
            },
            "imageSize": {
                "width": 0,
                "height": 0
            },
            "canvasSize": {
                "width": 22,
                "height": 0
            },
            "scale": "1:10000"
        }
    ]
};

exports.seller={
    "id": 1,
    "name": "Crocs",
    "logo": "/images/placemap_pic.png",
    "category": {
        "id": 1,
        "name": "鞋"
    },
    "status": "已注册",
    "promotionNumber": 3,
    "tag": "时尚；青年",
    "desc": "商品不错",
    "images": [
        {
            "id": 1,
            "url": "/images/placemap_pic.png"
        },
        {
            "id": 2,
            "url": "/images/placemap_pic.png"
        }
    ]
};

exports.device={
    "BleMac": 1,
    "uuid": "ES123654",
    "major": 2,
    "minor": 1,
    "name": "Crocs",
    "createDate": "2014-01-01",
    "nextMaintainDate": "2014-09-01",
    "status": "运行中"
};

exports.promotion={
    "id": 1,
    "name": "Crocs7.5折",
    "seller": "Crocs",
    "category": {
        "id": 1,
        "name": "折扣"
    },
    "tag": "时尚；青年",
    "startDate": "2014-8-15",
    "endDate": "2014-8-19",
    "status": "待审批",
    "images": [
        {
            "id": 1,
            "url": "/images/placemap_pic.png"
        },
        {
            "id": 2,
            "url": "/images/placemap_pic.png"
        }
    ],
    "desc": "fdsafdsafds"
};

exports.matrix={};
