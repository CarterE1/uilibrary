
/**
 * Custom blocks
 */
//% weight=10 color=#f29100 icon="\uf3fa"
//% groups=['Elements', 'Pages']
namespace UILibrary {
    //% block="create button $sprite || when clicked"
    //% blockId="createbutton"
    //% sprite.shadow="variables_get"
    //% sprite.defl="mySprite"
    //% group="Elements"
    //% weight=100
    export function createButton(sprite: Sprite): UIElement {
        return new UILibrary.UIElement(sprite)
    }

    //% block="when $element button is clicked run"
    //% blockId="onbuttonclick"
    //% element.shadow="variables_get"
    //% element.defl="button"
    //% group="Elements"
    //% handlerStatement
    //% weight=99
    export function onButtonClick(element: UIElement, onClick: () => void) {
        element.SetOnClick(onClick)
    }

    //% block="create page using $elements"
    //% blockId="uilibrary_createpage"
    //% elements.shadow="lists_create_with"
    //% elements.defl="createbutton"
    //% group="Pages"
    //% weight=100
    export function createPage(elements: any[]): UIPage {
        return new UILibrary.UIPage(elements)
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