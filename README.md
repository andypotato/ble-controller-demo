# BLE Controller Demo
Demo of a classic 8-bit game controller with motion controls and Bluetooth (BLE) connectivity implemented with Ionic 4 / Angular and Cordova. To use it you also need the [peripheral counterpart available at this repository](https://github.com/andypotato/ble-receiver-demo "peripheral counterpart available at this repository").

This project is part of a [tutorial on using Bluetooth Controllers with HTML5 / JavaScript applications](https://medium.com/@andreas.schallwig "tutorial on using Bluetooth Controllers with HTML5 / JavaScript applications").

## Usage

- Android users can directly [use the pre-built APK](https://github.com/andypotato/ble-controller-demo/releases "use the pre-built APK")
- IOS users must build the app from source with the [Ionic 4 framework](https://ionicframework.com/ "Ionic 4 framework")

Upon running the App you will see this screen:

![Controller is disconnected](https://raw.githubusercontent.com/andypotato/ble-controller-demo/master/docs/phone-disconnected.png "Controller is disconnected")

You will recognize the traditional button layout of an 8-bit controller with the D-Pad directional buttons on the left and the usual buttons for start / select, A and B on the right. Try pressing some buttons and the value next to "Btn" should update.

In addition when you move the phone the values for Pitch, Roll and Yaw should update according to how you're holding the phone. Note that Pitch and Roll uses values between -180 and 180 degrees while Yaw uses 0 to 360 degree values.

Once you have the [Bluetooth receiver](https://github.com/andypotato/ble-receiver-demo "Bluetooth receiver") up and running you can tap the Bluetooth icon on the top right to connect. If the connection was successful the screen will update:

![Controller is connected](https://raw.githubusercontent.com/andypotato/ble-controller-demo/master/docs/phone-connected.png "Controller is connected")

You should now be able to see the controller input on the receiver side. To disconnect press the "pause" icon on the top right.

## How to build
A working development environment for Ionic 4 Apps and your platform of choice (Android or IOS) is required to build this App. If you don't have Ionic and Cordova installed yet you can follow [this tutorial](https://ionicframework.com/docs/installation/cli").

- Clone the repository to your local computer
- Install all dependencies using `npm install`
- Install the global Native Run package using `npm install -g native-run`

**Android:**
- Connect your phone via USB
- Make sure the USB transfer mode is enabled
- Run `ionic cordova run android`

The App should automatically install and run.

**IOS:**
- Build the App using `ionic cordova build ios`
- Open the `.xcodeproj` file in `platforms/ios/` in Xcode
- Configure your code signing settings (Automatic signing usually works)
- Go to **File**, then **Workspace Settings** (sometimes also labled **Project Settings**)
- Select **Legacy Build System** from the Build System dropdown.
- Now you can your App using `ionic cordova run ios`
