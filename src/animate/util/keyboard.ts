const keyboardKeys: { [id: string]: boolean } = {}
const setupKeyboardTracking = () => {
  document.body.addEventListener("keydown", (e) => (keyboardKeys[e.key] = true))
  document.body.addEventListener("keyup", (e) => (keyboardKeys[e.key] = false))
}

export { setupKeyboardTracking, keyboardKeys }
