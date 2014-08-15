//
//  ABViewController.m
//  TestSDKPod
//
//  Created by liaojinhua on 14-5-7.
//  Copyright (c) 2014年 AprilBrother. All rights reserved.
//

#import "ABViewController.h"
#import "ABTransmitters.h"
#import "JSONKit.h"
#import "AFHTTPRequestOperationManager.h"
#import "AFHTTPRequestOperation.h"
#import "UIDevice+serialNumber.h"

@interface ABViewController ()

@property (nonatomic, strong) ABBeaconManager *beaconManager;
@property (nonatomic, strong) NSMutableDictionary *tableDataDic;
@property (nonatomic, strong) NSMutableArray *tableDataArray;
@property (nonatomic, strong) NSMutableArray *beaconInfoArray;
@property (nonatomic,assign) NSInteger numInteger;
@end

@implementation ABViewController

- (id)initWithCoder:(NSCoder *)aDecoder
{
    if (self = [super initWithCoder:aDecoder]) {
        self.beaconManager = [[ABBeaconManager alloc] init];
        self.beaconManager.delegate = self;
        
        _tableDataDic = [NSMutableDictionary dictionary];
        _tableDataArray = [NSMutableArray array];
        _beaconInfoArray = [NSMutableArray array];
        _numInteger = 0;
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
	// Do any additional setup after loading the view, typically from a nib.
    [self.beaconManager addCustomBeaconNameFilter:@"AprilBeacon"];
    self.refreshControl = [[UIRefreshControl alloc] init];
    [self.refreshControl addTarget:self
                            action:@selector(startRangeBeacons)
                  forControlEvents:UIControlEventValueChanged];
    
    
    [self startTimer];
    [self startPostInfoTimer];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    [self startRangeBeacons];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self stopRangeBeacons];

}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - Table view data source

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    
    return [[_tableDataDic allValues][section] count];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return _tableDataDic.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    ABBeacon *beacon = [_tableDataDic allValues][indexPath.section][indexPath.row];
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"beaconCell"];
    
    cell.textLabel.text = [beacon.proximityUUID UUIDString];
    
    NSString *proximity;
    switch (beacon.proximity) {
        case CLProximityFar:
            proximity = @"Far";
            break;
        case CLProximityImmediate:
            proximity = @"Immediate";
            break;
        case CLProximityNear:
            proximity = @"Near";
            break;
        default:
            proximity = @"Unknown";
            break;
    }
    cell.detailTextLabel.text = [NSString stringWithFormat:@"Major: %@, Minor: %@, Acc: %.2fm, proximity=%@", beacon.major, beacon.minor, [beacon.distance floatValue], proximity];
  
    return cell;
}

#pragma mark - ABBeaconManagerDelegate
- (void)beaconManager:(ABBeaconManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(ABBeaconRegion *)region
{
  
    [self.refreshControl endRefreshing];
    [_tableDataDic removeObjectForKey:region];
    [_tableDataDic setObject:beacons forKey:region];
    
    [self.tableView reloadData];
}

- (void)beaconManager:(ABBeaconManager *)manager rangingBeaconsDidFailForRegion:(ABBeaconRegion *)region withError:(NSError *)error
{
    [self.refreshControl endRefreshing];
    [_tableDataDic removeObjectForKey:region];
    [self.tableView reloadData];
}

#pragma mark - Custom methods

- (void)startRangeBeacons
{
    [self stopRangeBeacons];
    
    ABTransmitters *tran = [ABTransmitters sharedTransmitters];
    [[tran transmitters] enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        NSUUID *proximityUUID = [[NSUUID alloc] initWithUUIDString:obj[@"uuid"]];
        NSString *regionIdentifier = obj[@"uuid"];
        
        ABBeaconRegion *beaconRegion;
        beaconRegion = [[ABBeaconRegion alloc] initWithProximityUUID:proximityUUID
                                                          identifier:regionIdentifier];
        beaconRegion.notifyOnEntry = YES;
        beaconRegion.notifyOnExit = YES;
        beaconRegion.notifyEntryStateOnDisplay = YES;
        [_beaconManager startRangingBeaconsInRegion:beaconRegion];
    }];
}

- (void)stopRangeBeacons
{
    ABTransmitters *tran = [ABTransmitters sharedTransmitters];
    [[tran transmitters] enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL *stop) {
        NSUUID *proximityUUID = [[NSUUID alloc] initWithUUIDString:obj[@"uuid"]];
        NSString *regionIdentifier = obj[@"uuid"];
        
        ABBeaconRegion *beaconRegion;
        beaconRegion = [[ABBeaconRegion alloc] initWithProximityUUID:proximityUUID
                                                          identifier:regionIdentifier];
        [_beaconManager stopRangingBeaconsInRegion:beaconRegion];
    }];

}

- (void)startTimer
{
	dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0), ^(void) {
		NSTimer *timer = [[NSTimer alloc] initWithFireDate:[NSDate date]
                                                  interval:0.50
                                                    target:self
                                                  selector:@selector(collectBeaconData:)
                                                  userInfo:nil
                                                   repeats:YES];
		NSRunLoop *runloop = [NSRunLoop currentRunLoop];
		[runloop addTimer:timer forMode: NSDefaultRunLoopMode];
        [runloop run];
	});
}

-(void)collectBeaconData:(NSTimer *)timer
{
    if (_tableDataDic.count > 0) {
        NSMutableArray *dataArray = [NSMutableArray arrayWithCapacity:0];
        NSArray * array = [NSArray arrayWithArray:[[_tableDataDic allValues] lastObject]];
        if (array.count > 0) {
            for (ABBeacon *beacon in array) {
                
                NSDictionary *dic = @{@"uuid":[beacon.proximityUUID UUIDString],@"major":[NSString stringWithFormat:@"%@",beacon.major],@"minor":[NSString stringWithFormat:@"%@",beacon.minor],@"beaconBLE":@"",@"acc":[NSString stringWithFormat:@"%.2f",[beacon.distance floatValue]]};
                [dataArray addObject:dic];
            }
            NSDictionary *dic = @{@"checkPoint": [self getTimeNow],@"beaconPKG":dataArray};
            [_beaconInfoArray addObject:dic];
        }
        
    }

}


- (NSString *)getTimeNow
{
    NSString* date;
    
    NSDateFormatter * formatter = [[NSDateFormatter alloc ] init];
    [formatter setDateFormat:@"YYYY-MM-dd hh:mm:ss:SSSS"];
    date = [formatter stringFromDate:[NSDate date]];
    NSString *timeNow = [[NSString alloc] initWithFormat:@"%@", date];
    
    return timeNow;
}

- (void)startPostInfoTimer
{
   dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0), ^(void) {
		NSTimer *timer = [[NSTimer alloc] initWithFireDate:[NSDate date]
                                                  interval:5.0
                                                    target:self
                                                  selector:@selector(postBeaconData:)
                                                  userInfo:nil
                                                   repeats:YES];
		NSRunLoop *runloop = [NSRunLoop currentRunLoop];
		[runloop addTimer:timer forMode: NSDefaultRunLoopMode];
       [runloop run];
});
}

- (void)postBeaconData:(NSTimer *)timer
{
    if ([_beaconInfoArray count] > 0) {
        
        NSDictionary *dict = @{@"deviceName": DEVICE_NAME,@"deviceSerial":[[UIDevice currentDevice] serialNumber],@"monitorPackage":_beaconInfoArray};
        
        NSString *bodyString = [NSString stringWithFormat:@"%@",[dict JSONString]] ;
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"http://192.168.100.248:1337/sensorData"]];
        
        [request setTimeoutInterval:10.f];
        [request setHTTPMethod:@"POST"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setHTTPBody: [bodyString dataUsingEncoding:NSUTF8StringEncoding]];
        AFHTTPRequestOperation *operation = [[AFHTTPRequestOperation alloc]initWithRequest:request];
        [operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject)
         {
             if ([responseObject isKindOfClass:[NSData class]]) {
                 NSDictionary *dict = [responseObject objectFromJSONData];
               
                 NSInteger coder = [[dict objectForKey:@"response"][@"resultCode"] integerValue];
                 if (coder == 0) {
                     
                     NSLog(@"successful!!");
                 }else{
               
                   NSLog(@"fail!!");
                 }
             }
             
         } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
     
       
             NSLog(@"another fail is %@!!",error);
    
         }];
        [operation start];
        
        [_beaconInfoArray removeAllObjects];
    }
}

@end













