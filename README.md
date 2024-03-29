# In Arm's Reach

"In Arm's Reach" is a WebXR app created over the course of 2.5 days for MIT RealityHack 2024. It's using [Needle Engine](https://needle.tools) and Unity to bring the experience to anyone on the web.  

**Video:** ["In Arm's Reach" on YouTube](https://www.youtube.com/watch?v=_xDjOlSIrU0)  
**WebXR App:** [hybridherbst.github.io/in-arms-reach](https://hybridherbst.github.io/in-arms-reach/)  
**More Details:** [Devpost Submission](https://devpost.com/software/test-h62z5t)  
**Contact Us:** [via email](mailto:katja.rempel3@gmail.com)

[![In Arm's Reach hero Image](https://hybridherbst.github.io/in-arms-reach/include/in-arms-reach.jpg)](https://www.youtube.com/watch?v=_xDjOlSIrU0)

## Setup

To get started, you will need to install the following:  
- Unity 2022.3.17f1
- Node.js v18+ (v20.9.0 used here)
- VS Code

## Development

The main scene is called `LivingHarmony.unity`. It contains an `ExportInfo` component with Needle-specific settings.  

You may need to accept the Needle Engine EULA in the Unity Editor before you can build the project (a window will pop up) – it's available for free for non-commercial use.  

When you press <kbd>Play</kbd>, a browser window will open with your project already being live on a local server, running on your machine.  
You can test the app in any browser – open the local URL on a Quest 2/3 device in the same local network as your computer and then click on <kbd>Enter AR</kbd> or <kbd>Enter VR</kbd>.  

The accompanying web project uses TypeScript and Svelte and can be opened via `needle/workspace.code-workspace`, or by clicking on <kbd>Open Workspace</kbd> from within Unity with the ExportInfo object selected.

To build and bundle the project,  
- go to File > Build Settings in Unity  
- select Needle Engine  
- click on Build  

The resulting folder can be uploaded to a web server and contains a self-contained static web app.  

### Water, Ice and Fire Scene Setup

Each scene has an animated Timeline that starts playing once the first spot on a wall is touched. This allows for a lot of creative freedom in terms of placement, animation, and audio design – for example, a turtle can wait right behind your wall, or an iceberg can crush immediately in front if your feet.   

Scenes can provide additional interactive control and challenges. One of the turtles in the Water scene slowly approaches the user, and the user can collect various pieces of trash floating in the ocean.   

## Building 


## Rendering Overview

A main feature of In Arm's Reach is the ability to look behind your walls and bring a virtual environment into your room. This is enabled by WebXR features that are backed by Meta's Presence Platform. 

We're rendering in a very specific order:  

- Quest OS Room Setup provides spatial planes (walls, floors) to WebXR experiences as part of the `plane-tracking` WebXR feature.
- When starting an `immersive-ar` WebXR session, features like hand tracking and plane tracking are requested.
- Planes are set up as Occluders, which render depth but not color.
  - This makes them invisible, but other objects will clip against them (you can't see behind them).
- When a hand or controller is close to a wall, 
  - the Environmental Scenes are placed at the first touch point
  - at a regular distance, new animated Depth Cutters are placed.
- Depth Cutters "punch" holes into the depth buffer that has already been seeded by the tracked planes.  
- Portal "fringes" are rendered after occluders but before depth cutters, so that there are no fringes inside of portals.  
- After this, all other scene geometry is rendered.  

In a future update, we'd like to incorporate Quest Depth Sensing into rendering this pipeline, which provides real-time occlusion, for even greater immersion.

## Multi-User Support

To start a session with other people:

1. Ensure all users have a valid Room Setup.
2. All users should recenter the Meta Quest on a spot that’s roughly 3 metres away from your wall. If users are in the same physical location, they should recenter on the same spot.
3. Append `?room=ABCD` to the URL and refresh the page (some random room ID).
4. Send the full URL to others so they can join the same session.
5. If there was a previous session in that room, click on “Menu” and “Reset” in the upper right corner of the page. This is a workaround to clear outdated synchronised data and would not be needed for a production application.
6. Have all people enter the AR session.
7. Once everyone has **touched a wall at least once** synchronisation is in effect. There may be a red overlay visible when a user hasn’t touched a wall at least once.


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

**Contact us:** [via email](mailto:katja.rempel3@gmail.com)

- Katja Rempel (interaction design, storyboarding, UI)
- Zack Wang (sound design, music)
- Afrida Mehzabin (3D assets, textures, animations)
- Julian Hoffmann (additional 3D assets, prototyping)
- Felix Herbst (UX concept, development, shaders)

## Shout-Outs

We'd like to thank the MIT RealityHack team for organizing this hackathon! It was a great experience and we're looking forward to the next one. 
