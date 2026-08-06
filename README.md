# truenote

Complete Prompt for Lovable

Build a Digital Bouquet & Interactive Message Card Web App where users can create a virtual flower bouquet, place a personalized message card inside it, and share it with someone through a unique link.

The goal is to create an emotional and interactive digital greeting experience instead of a static card.

Core Concept

A user creates a digital bouquet, customizes flowers and bouquet style, and writes a personal message on a card that is hidden inside the bouquet.

When the receiver opens the shared link, they first see a closed bouquet.
When they tap it, the bouquet opens with animation and reveals the message card inside.

The bouquet can also contain interactive flowers with memories or voice messages.

Main Features

1. Bouquet Creator

Allow users to design their own bouquet.

Customization options should include:

Flower types (roses, tulips, lilies, sunflowers, mixed bouquet)

Flower colors

Number of flowers

Ribbon style and ribbon color

Bouquet wrapping style

The app should display a live preview of the bouquet while the user customizes it.

2. Message Card Inside the Bouquet

Allow the sender to add a digital greeting card hidden inside the bouquet.

The card editor should support:

Writing a custom message

Selecting font styles

Choosing card colors or themes

Adding emojis

The card should remain hidden until the bouquet is opened by the receiver.

3. Memory Flowers

Each flower can optionally contain a memory element.

When creating the bouquet, the sender can click a flower and attach:

A short text message

A photo

A voice message

When the receiver taps a flower, the attached memory opens in a small popup.

Example interactions:

Tap a rose → shows a photo

Tap another flower → plays a voice message

Tap another flower → shows a small note

4. Bouquet Opening Animation

When the receiver opens the shared link:

Step 1
Display a welcome message:

“Someone sent you a digital bouquet.”

Step 2
Show a closed bouquet in the center of the screen.

Step 3
Display instruction text:

“Tap to open your bouquet.”

Step 4
When tapped:

The bouquet slowly blooms open

Flowers spread outward

A greeting card slides out from the center

Soft falling petal animation appears

5. Voice Message Feature

Allow the sender to optionally record a short voice message.

When the bouquet opens, a small audio player appears so the receiver can play the message.

6. Preview Before Sending

Before sharing, the sender should be able to:

Preview bouquet opening animation

Edit bouquet design

Edit message card

Edit flower memories

Listen to the voice note

7. Shareable Link System

After the bouquet is created, generate a unique shareable link.

Provide sharing options:

Copy link

Share to WhatsApp

Share to Instagram

Share through messaging apps

8. Receiver Experience

When the receiver opens the link:

Screen 1
Message: “Someone sent you a bouquet.”

Screen 2
Closed bouquet appears.

Screen 3
User taps bouquet → bouquet opens with animation.

Screen 4
User sees:

Greeting card

Interactive flowers with memories

Optional voice message

Screen 5
Show button:

“Create a bouquet for someone you love.”

This encourages users to create and share their own bouquet.

UI Design Requirements

The interface should be:

Clean and minimal

Soft pastel color palette

Elegant and modern

Mobile responsive

Smooth animations and transitions

The bouquet should appear centered with subtle shadows and stylized flower illustrations.

Application Pages

Home Page
Create Bouquet Page
Bouquet Customization Page
Message Card Editor
Memory Flower Editor
Preview Page
Shared Bouquet Viewer

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://truenote.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8a947be4-075d-4f06-bee3-337602a4f80d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
