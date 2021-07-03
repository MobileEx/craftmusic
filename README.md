# Welcome to the Craft Music frontend app!

You'll need a mac os device and Xcode to run the app in development and install a few neccessary dependencies:

Clone the git repo and make sure you're inside the repo folder

You'll need Yarn installed for this. In the craftmusic directory in terminal, run:

`yarn install`

`brew install node`

`brew install watchman`

`cd ios && pod install`

`cd ..`

`react-native start` (starts metro bundler)

To start the app, in another terminal tab in the craftmusic directory, run:

`react-native run-ios --simulator="iPhone11"` (use iPhone 11 to make sure the app works on the latest iOS)


in accordance with changes in React Native 0.60 this project has now been reworked to use cocoapods and reconfigured with a .podsfile that integrates core react-native pods and the react-native-ffmpeg library, after adding native modules via `yarn add` make sure to pod install, as well as making sure to pod install when pulling down the latest changes / switching branches etc..

`cd ios && pod install`

You can also start the bundler and run the application via opening the xcode project to run via the Xcode debugger.

  
You must use a real ios device to work with Camera functionality, Camera does not work in the simulator.
You can run on a real ios device by opening the Xcode project and selecting build Destination to your device.

We are utilizing a Redux store to manage application state and distribute it via Redux connect() macros that maps state to props for components that need the data.

Use fetch() for network requests.


Work in your branch and add commits to your branch via `git add (file name or directory name)` or using the GitHub desktop app. Then `pull origin master` into your branch, and `push origin (your branch name)` into your branch. Be sure to resolve all merge conflicts before creating a PR.
