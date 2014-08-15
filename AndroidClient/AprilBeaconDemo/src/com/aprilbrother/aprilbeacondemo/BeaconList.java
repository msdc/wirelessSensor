package com.aprilbrother.aprilbeacondemo;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Environment;
import android.os.RemoteException;
import android.provider.Settings.Secure;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;
import android.widget.Toast;

import com.aprilbrother.aprilbeacondemo.BeaconList.MyData.MyMonitor;
import com.aprilbrother.aprilbeacondemo.BeaconList.MyData.MyMonitor.MyBeacon;
import com.aprilbrother.aprilbrothersdk.Beacon;
import com.aprilbrother.aprilbrothersdk.BeaconManager;
import com.aprilbrother.aprilbrothersdk.BeaconManager.MonitoringListener;
import com.aprilbrother.aprilbrothersdk.BeaconManager.RangingListener;
import com.aprilbrother.aprilbrothersdk.Region;
import com.google.gson.Gson;

/**
 * 搜索展示beacon列表
 */
public class BeaconList extends Activity {
	private static final int REQUEST_ENABLE_BT = 1234;
	private static final String TAG = "BeaconList";
	// private static final Region ALL_BEACONS_REGION = new Region("apr",
	// "B9407F30-F5F8-466E-AFF9-25556B57FE6D",
	// null, null);
	private static final Region ALL_BEACONS_REGION = new Region("apr", null,
			null, null);
//	private static final Region ALL_BEACONS_REGION_1 = new Region("apr", "aa000000-0000-0000-0000-000000000000",
//			null,null);
//	private static final Region ALL_BEACONS_REGION = new Region("apr", "aa000000-0000-0000-0000-000000000000",
//			null, null);
	private BeaconAdapter adapter;
	private BeaconManager beaconManager;
	private ArrayList<Beacon> myBeacons;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		init();
	}
	
	/**
	 * 初始化操作
	 */
	private void init() {
		myBeacons = new ArrayList<Beacon>();
		ListView lv = (ListView) findViewById(R.id.lv);
		adapter = new BeaconAdapter(this);
		lv.setAdapter(adapter);
		beaconManager = new BeaconManager(this);
		beaconManager.setForegroundScanPeriod(500, 0);
		beaconManager.setRangingListener(new RangingListener() {

			@Override
			public void onBeaconsDiscovered(Region region,
					final List<Beacon> beacons) {

				if(beacons.size() > 3){
				
					collectTime = System.currentTimeMillis();
					
					if(myData == null) myData = new MyData();
					
					MyMonitor myMonitor = myData.new MyMonitor();
					myMonitor.checkPoint = getDateFormat(collectTime);
					
//					Log.v("TESTLOG", "collect---size:" + myData.monitorPackage.size() + "---" + myMonitor.checkPoint);
					
					MyBeacon myBeacon;
					for(Beacon beacon : beacons){
						myBeacon = myMonitor.new MyBeacon();
						myBeacon.uuid = beacon.getProximityUUID();
						myBeacon.major = beacon.getMajor() + "";
						myBeacon.minor = beacon.getMinor() + "";
						myBeacon.beaconBLE = beacon.getMacAddress();
						myBeacon.acc = beacon.getDistance() + "";

						myMonitor.beaconPKG.add(myBeacon);
						myBeacon = null;
					}
					
					myData.monitorPackage.add(myMonitor);
					myMonitor = null;
				
					if(myData != null && myData.monitorPackage.size() == 10){
						sendTime = System.currentTimeMillis();
//						Log.v("TESTLOG", "send---" + getDateFormat(sendTime) + ", size=" + myData.monitorPackage.size());
							
						myData.deviceName = android.os.Build.MODEL;
						myData.deviceSerial = getDeviceId(BeaconList.this);
	
						Gson gson = new Gson();
						String jsonStr = gson.toJson(myData);
						
						Log.v("TESTLOG", jsonStr);
	
						if(Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())){
							try {
								File file = getDiskCacheDir(BeaconList.this, "jsonstring");
								PrintWriter pw = new PrintWriter(new FileOutputStream(file));
								pw.println(jsonStr);
								pw.close();
							} catch (Exception e) {
								e.printStackTrace();
							}
						}
						
						sendData(jsonStr);
						
						myData = null;
					}
					
				}
				
				myBeacons.addAll(beacons);
				
				if(beacons!=null && beacons.size()>0)
				Log.i(TAG, "rssi = "+beacons.get(0).getRssi());

				runOnUiThread(new Runnable() {
					@Override
					public void run() {
						getActionBar().setSubtitle(
								"Found beacons: " + beacons.size());
						adapter.replaceWith(beacons);
					}
				});
			}
		});
		
		beaconManager.setMonitoringListener(new MonitoringListener() {
			
			@Override
			public void onExitedRegion(Region arg0) {
				Toast.makeText(BeaconList.this, "通知离开", 0).show();
				
			}
			
			@Override
			public void onEnteredRegion(Region arg0, List<Beacon> arg1) {
				Toast.makeText(BeaconList.this, "通知进入", 0).show();
			}
		});
		
		lv.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> arg0, View arg1, int arg2,
					long arg3) {
				Intent intent = new Intent(BeaconList.this,
						ModifyActivity.class);
				Beacon beacon = myBeacons.get(arg2);
				Bundle bundle = new Bundle();
				bundle.putParcelable("beacon", beacon);
				intent.putExtras(bundle);
				startActivity(intent);
			}
		});
	}
	
	/**
	 * 连接服务 开始搜索beacon
	 */
	private void connectToService() {
		getActionBar().setSubtitle("Scanning...");
		adapter.replaceWith(Collections.<Beacon> emptyList());
		beaconManager.connect(new BeaconManager.ServiceReadyCallback() {
			@Override
			public void onServiceReady() {
				try {
					beaconManager.startRanging(ALL_BEACONS_REGION);
					beaconManager.startMonitoring(ALL_BEACONS_REGION);
				} catch (RemoteException e) {
					
				}
			}
		});
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == REQUEST_ENABLE_BT) {
			if (resultCode == Activity.RESULT_OK) {
				connectToService();
			} else {
				Toast.makeText(this, "Bluetooth not enabled", Toast.LENGTH_LONG)
						.show();
				getActionBar().setSubtitle("Bluetooth not enabled");
			}
		}
		super.onActivityResult(requestCode, resultCode, data);
	}

	@Override
	protected void onStart() {
		super.onStart();

		if (!beaconManager.hasBluetooth()) {
			Toast.makeText(this, "Device does not have Bluetooth Low Energy",
					Toast.LENGTH_LONG).show();
			return;
		}

		if (!beaconManager.isBluetoothEnabled()) {
			Intent enableBtIntent = new Intent(
					BluetoothAdapter.ACTION_REQUEST_ENABLE);
			startActivityForResult(enableBtIntent, REQUEST_ENABLE_BT);
		} else {
			connectToService();
		}
	}

	@Override
	protected void onDestroy() {
//		beaconManager.disconnect();
		super.onDestroy();
	}

	@Override
	protected void onStop() {
		try {
			myBeacons.clear();
			beaconManager.stopRanging(ALL_BEACONS_REGION);
		} catch (RemoteException e) {
			Log.d(TAG, "Error while stopping ranging", e);
		}
		super.onStop();
	}
	
	//------------------收集信息-------------------------
	
	public static final String POST_URL = "http://192.168.100.2:1337/sensorData";
	
	public static final long COLLECT_INTERVAL = 500;
	public static final long SEND_INTERVAL = 5000;
	
	private long collectTime = System.currentTimeMillis();
	private long sendTime = System.currentTimeMillis();
	private MyData myData = new MyData();
	
	public static String getDateFormat(long time, String formatString){
		if(TextUtils.isEmpty(formatString)){
			formatString = "yyyy-MM-dd HH:mm:ss:SSSS";
		}
		SimpleDateFormat format = new SimpleDateFormat(formatString);
		return format.format(new Date(time)) + "0";
	}
	
	public static String getDateFormat(long time){
		return getDateFormat(time, "yyyy-MM-dd HH:mm:ss:SSS");
	}
	
	public static String getDeviceId(Context context) {
		String androidId = Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
		if ((androidId == null) || (androidId.equals("9774d56d682e549c")) || (androidId.equals("0000000000000000"))) {
			androidId = "";
		}
		return androidId;
	}
	
	public static String getDiskCachePath(Context context) {
		String cachePath = "";
		if (Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())
//	            || !Environment.isExternalStorageRemovable()//api >= 9
				) {
			cachePath = context.getExternalCacheDir().getPath();
		} else {
			cachePath = context.getCacheDir().getPath();
		}
		return cachePath;
	}
	
	public static File getDiskCacheDir(Context context, String uniqueName) {
		return new File(getDiskCachePath(context) + File.separator + uniqueName);
	}
	
	private void sendData(final String jsonStr) {
		new Thread(){
			public void run() {
				if(!TextUtils.isEmpty(jsonStr) && !TextUtils.isEmpty(POST_URL)){
					byte[] jsonBytes = jsonStr.getBytes();
					try {
						URL url = new URL(POST_URL);
						HttpURLConnection conn = (HttpURLConnection) url.openConnection();
						conn.setConnectTimeout(5000);
						conn.setDoOutput(true);
						conn.setDoInput(true);
						conn.setUseCaches(false);
						conn.setRequestMethod("POST");
						conn.setRequestProperty("Charset", "UTF-8");
						conn.setRequestProperty("Content-Length", String.valueOf(jsonBytes.length));
						conn.setRequestProperty("Content-Type", "application/json");

						OutputStream os = conn.getOutputStream();
						os.write(jsonBytes);
						os.flush();
						os.close();

						InputStream is = conn.getInputStream();
						String responseStr = "";
						try {
							Scanner scanner = new Scanner(is);
							responseStr = scanner.useDelimiter("\\A").next();
						} catch (Exception e1) {
						}

						Log.w("TESTLOG", "response: " + responseStr);

//						Gson gson = new Gson();
//						SendResponse sendResponse = gson.fromJson(responseStr,
//								SendResponse.class);
//						if ("true".equals(sendResponse.result)) {
//							Log.w("TESTLOG", "result: " + sendResponse.message);
//						} else {
//							Log.w("TESTLOG", "result: " + sendResponse.message);
//						}

					} catch (Exception e) {
						e.printStackTrace();
						Log.e("TESTLOG", "sendData error: " + e.fillInStackTrace().toString());
					}
				}
			};
		}.start();
	}
	
	class MyData{
		public String deviceName;
		public String deviceSerial;
		public List<MyMonitor> monitorPackage = new ArrayList<BeaconList.MyData.MyMonitor>();
		
		@Override
		public String toString() {
			return "MyData [deviceName=" + deviceName + ", deviceSerial="
					+ deviceSerial + ", monitorPackage=" + monitorPackage + "]";
		}
		
		class MyMonitor{
			public String checkPoint;
			public List<MyBeacon> beaconPKG = new ArrayList<BeaconList.MyData.MyMonitor.MyBeacon>();
			
			@Override
			public String toString() {
				return "MyMonitor [checkPoint=" + checkPoint + ", beaconPKG="
						+ beaconPKG + "]";
			}
			
			class MyBeacon{
				public String uuid;
				public String major;
				public String minor;
				public String beaconBLE;
				public String acc;
				@Override
				public String toString() {
					return "MyBeacon [uuid=" + uuid + ", major=" + major + ", minor="
							+ minor + ", beaconBLE=" + beaconBLE + ", acc=" + acc + "]";
				}
			}
		}
	}
	
	class SendResponse{
		public String result;
		public String message;
	}
	
	//------------------收集信息-------------------------
}
