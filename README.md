wirelessSensor
==============

POC for wirelessSensor using nodejs

it is using redis "sol-redis-pool" app pool. so you need to change the line in its index.js file.

line 83 to line 89

    // The destroy function is called when client connection needs to be closed.
    poolSettings["destroy"] = function destroyClient(client) {
        if (client) {
            client.end();
        }
        self.emit("destroy", null);
    }



the raw data format is

{
    "deviceSerial": "F2LJMKYDDTWD",
    "deviceName": "Ning'92s iPhone",
    "monitorPackage": [
        {
            "checkPoint": "2014-08-13 02:39:33:1460",
            "beaconPKG": [
                {
                    "major": "0",
                    "minor": "4",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                },
                {
                    "major": "0",
                    "minor": "2",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                },
                {
                    "major": "0",
                    "minor": "1",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                },
                {
                    "major": "0",
                    "minor": "3",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                }
            ]
        },
        {
            "checkPoint": "2014-08-13 02:39:33:6460",
            "beaconPKG": [
                {
                    "major": "0",
                    "minor": "4",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                },
                {
                    "major": "0",
                    "minor": "2",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                },
                {
                    "major": "0",
                    "minor": "1",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                },
                {
                    "major": "0",
                    "minor": "3",
                    "uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0",
                    "beaconBLE": "",
                    "acc": "-1.00"
                }
            ]
        }
    ]
}

