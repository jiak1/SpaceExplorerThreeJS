const { GamepadListener } = require("gamepad.js")

const keyboardKeys: { [id: string]: boolean } = {}
const setupKeyboardTracking = () => {
  document.body.addEventListener("keydown", (e) => (keyboardKeys[e.key] = true))
  document.body.addEventListener("keyup", (e) => (keyboardKeys[e.key] = false))
}

const listener = new GamepadListener({
  analog: false,
  deadZone: 0.3,
})

listener.on("gamepad:button", (event) => {
  const {
    index, // Gamepad index: Number [0-3].
    gamepad, // Native Gamepad object.
  } = event.detail
})
listener.start()

export { setupKeyboardTracking, keyboardKeys }
