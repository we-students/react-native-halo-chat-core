# @westudents/react-native-halo-chat-core

<div align="center">

[![javascript][standard-westudents-badge]][standard-westudents]
[![NPM version][npmjs-badge]][npmjs-com]
[![github stars][github-repo-stars]][github-repo]

</div>

A Firebase chat sdk for React Native applications
## Installation

Halo Chat is based on Firebase services, for this reason let's install these libraries:


```sh
npm i @react-native-firebase/app@^14 @react-native-firebase/auth@^14 @react-native-firebase/firestore@^14 @react-native-firebase/storage@^14
```

We can now install Halo Chat

```sh
npm install @westudents/react-native-halo-chat-core
```

## Configure Firebase

We now have to setup a new project on [Firebase console](https://console.firebase.google.com/) and add it to our app, in order to do this you can follow official documentation [React Native Firebase](https://rnfirebase.io/)


## Usage

```js
import * as HaloChat from "@westudents/react-native-halo-chat-core";

// ...

const room = await HaloChat.RoomActions.createRoomWithUsers([otherUser])
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)


[npmjs-badge]: https://img.shields.io/npm/v/@westudents/react-native-halo-chat-core.svg?logo=npm
[npmjs-com]: https://www.npmjs.com/package/@westudents/react-native-halo-chat-core
[standard-westudents-badge]: https://img.shields.io/badge/sdk-westudents-orange.svg
[standard-westudents]: https://github.com/we-students/eslint-config-react-native

[github-repo-stars]: https://img.shields.io/github/stars/we-students/react-native-halo-chat-core?style=social
[github-repo]: https://github.com/we-students/react-native-halo-chat-chore