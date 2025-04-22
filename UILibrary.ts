
/**
 * Custom blocks
 */
//% weight=10 color=#f29100 icon="\uf3fa"
//% groups=['Elements', 'Pages']
namespace UILibrary {
    
    //% blockId="shadowSprite"
    export function shadowSprite(): Sprite {
        return sprites.create(img``)
    }
    
    //% block="create button $sprite with $onClick"
    //% blockId="uilibrary_createbutton"
    //% blockSetVariable="button"
    //% sprite.shadow = "shadowSprite"
    //% group="Elements"
    //% weight=100
    export function createButton(sprite: Sprite, onClick: Function): UIElement {
        return new UIElement(sprite, onClick)
    }
    
    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x: number, y: number) {
        // Check if button is clicked
        for (let item of UIElement.instances) {
            if (item.boundingBox.IsPositionInBoundingBox(x, y)) {
                item.OnClick()
            }
        }

        //  Start drag on scrolling frames
        for (let item of ScrollingFrame.instances) {
            ScrollingFrame.StartDrag(x, y)
        }
    })

    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Released, function(x: number, y: number) {
        // End drag on scrolling frames
        for (let item of ScrollingFrame.instances) {
            if (item.isDragging) {
                item.isDragging = false
            }
        }
    })
    
    forever(function() {
        if (browserEvents.MouseLeft.isPressed()) {
            for (let item of ScrollingFrame.instances) {
                if (item.isDragging) {
                    item.Drag(browserEvents.mouseY())
                }
            }
        }
    })
    
}

/* EXAMPLE BUTTON
// Create sprite, any sprite works but bounding box is always going to be a rectangle
let mySprite = sprites.create(img`dog`)

// If you want your UI element to be a button, you must assign it a function
let myFunc = () => { console.log("pressed") }

// Creates UI element, and UI page to store element
let myElement = new UIElement(mySprite, myFunc)
let myPage = new UIPage([myElement])

// Switches starting screen to be your page
UIPage.SwitchScreen(myPage)
*/