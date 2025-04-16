// title screen
let main_title = new UIElement(sprites.create(assets.image`main_title`))
main_title.SetPosition(80, 45)

let main_playButton = new UIElement(sprites.create(assets.image`main_playButton`), () => {
    UIPage.SwitchScreen(gamePage)
})
main_playButton.SetPosition(80, 100)


// game screen
let numCookies = 0
let game_cookie = new UIElement(sprites.create(assets.image`game_cookie`), () => {
    numCookies += 10
    game_scoreTextSprite.setText(numCookies.toString())
    game_scoreText.SetPosition(80, 20)
})
game_cookie.SetPosition(80, 80)

let game_scoreTextSprite = textsprite.create(numCookies.toString())
let game_scoreText = new UIElement(game_scoreTextSprite)
game_scoreText.SetPosition(80, 20)

// page def
let mainPage = new UIPage([main_title, main_playButton])
let gamePage = new UIPage([game_cookie, game_scoreText])

UIPage.SwitchScreen(mainPage)