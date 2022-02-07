# Difiwallet
  
## Build

This is an open wallet. Open integration for all blockchains. This example is introductory and implemented for the Dfinity blockchain using a non-native infrastructure

```
- npm run reinstall (wait for the operation)
- npm run nodejs-reinstall (wait for the operation)
- npm run nodejs-build (wait for the operation)
- npm run nodejs-copy (wait for the operation)
```
Correct the data in the file
node_modules/nodejs-mobile-react-native/android/build.gradle

(It was)
```
- sourceSets {
        main {
            jniLibs.srcDirs 'libnode/bin/'
        }
        main.assets.srcDirs += '../install/resources/nodejs-modules'
}
```
(Become) 
```
- sourceSets {
        //main {
        //    jniLibs.srcDirs 'libnode/bin/'
        //}
        main.assets.srcDirs += '../install/resources/nodejs-modules'
}
```

- npm run start


- npm run android (in another window)

or 

- npm run apk
- npm run aab

Google play: https://play.google.com/store/apps/details?id=com.dwi

### MIT License
