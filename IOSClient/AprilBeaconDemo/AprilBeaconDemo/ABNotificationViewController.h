//
//  ABNotificationViewController.h
//  TestSDKPod
//
//  Created by liaojinhua on 14-5-8.
//  Copyright (c) 2014年 AprilBrother. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "AprilBeaconSDK.h"

@interface ABNotificationViewController : UIViewController<ABBeaconManagerDelegate>

@property (nonatomic, strong) ABBeacon *beacon;

@end
