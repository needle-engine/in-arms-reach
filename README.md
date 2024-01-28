# In Arm's Reach

![In Arm's Reach Hero Image](https://hybridherbst.github.io/in-arms-reach/include/in-arms-reach.jpg)

Live page: [hybridherbst.github.io/in-arms-reach](https://hybridherbst.github.io/in-arms-reach/)  

## Setup

"In Arm's Reach" is a WebXR app created using [Needle Engine](https://needle.tools) and Unity for MIT RealityHack 2024. 

To get started, you will need to install the following:  
- Unity 2022.3.17f1
- Node.js v18+ (v20.9.0 used here)
- VS Code

## Development

The main scene is called `LivingHarmony.unity`. It contains an `ExportInfo` component with Needle-specific settings.  

You may need to accept the Needle Engine EULA in the Unity Editor before you can build the project (a window will pop up) – it's available for free for non-commercial use.  

When you press <kbd>Play</kbd>, a browser window will open with your project already being live. You can test the app in any browser – open it on a Quest 2/3 device in the same local network to view the app in AR or VR.  

## Usage

Once the page is live in your browser, you can view it on any device. 

"In Arm's Reach" is mainly designed for Augmented Reality on Quest 3 devices. To make it more widely available, we added support for other immersive modes and form factors as well. The experience will adapt to the capabilities of the device you're on (e.g. some support WebXR and others don't).  

Live page: [hybridherbst.github.io/in-arms-reach](https://hybridherbst.github.io/in-arms-reach/)  

### AR

By pressing "Enter AR", you start the experience. You'll be asked to complete Quest Room Setup if you haven't already.  

In Arm's Reach is an AR experience that accesses your room data to understand where walls are. Portals to environment challenges will open on your walls and allow you to engage with the environment.  

> Note: Make sure to follow the steps to go through Room Setup. If there are no walls set up, the experience will only work in VR mode, not in AR mode. 

### VR

You can also immersive yourself in VR completely. To do so, press "Enter VR" in the main menu. VR mode is also supported on visionOS.  

### iOS AR / visionOS AR

A fallback is provided for AR mode for iOS/visionOS devices. Click "Open QuickLook" on these devices to see a static version of the experience.  

### Browsers

"In Arm's Reach" is designed to be available for as many people as possible, leveraging the web as powerful and open distribution platform. Thus, you can access the experience in any browser.   

## Recommended Hardware

The experience has been mainly designed for and tested on Quest 3 with hand tracking enabled. Make sure to follow the steps to complete Room Setup.

## Compatible Hardware

- AR mode: Quest 2/3 with Room Setup completed. Both hand tracking and controllers are supported.
- VR mode: Any WebXR-compatible headset (e.g. Quest 2/3, Pico 4, Vision Pro, ...)
- Screen mode: Any device with a browser (e.g. desktop, laptop, tablet, smartphone, ...)

### Software Dependencies

- Unity 2022.3.17f1
- Node.js v18+ (v20.9.0 used here)
- VS Code
- Needle Engine 3.26.6-alpha (installed as dependency of the Unity project)

## Team

- Katja Rempel (interaction design, storyboarding, UI)
- Zack Wang (sound design, music)
- Afrida Mehzabin (3D assets, textures, animations)
- Julian Hoffmann (additional 3D assets, prototyping)
- Felix Herbst (UX concept, development, shaders)

## Shout-Outs

We'd like to thank the MIT RealityHack team for organizing this hackathon! It was a great experience and we're looking forward to the next one. 
