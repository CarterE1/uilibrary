class UIPage {
    static instances: UIPage[] = []
    public elements: UIElement[]

    constructor(elements: UIElement[]) {
        this.elements = elements
        UIPage.instances.push(this)
    }

    static SwitchScreen(newPage: UIPage) {
        for (let page of UIPage.instances) {
            page.HidePage()
        }
        newPage.ShowPage()
    }

    public HidePage() {
        for (let element of this.elements) {
            element.Hide()
        }
    }

    public ShowPage() {
        for (let element of this.elements) {
            element.Show()
        }
    }
}

class UIElement {
    static instances: UIElement[] = []
    public boundingBox: BoundingBox
    public sprite: Sprite
    public onClick: Function
    private isButton: boolean
    private hidden: boolean

    constructor(sprite: Sprite, onClick?: Function) {
        this.sprite = sprite
        this.boundingBox = new BoundingBox(sprite)

        if (onClick != null) {
            this.isButton = true
            this.onClick = onClick
        } else {
            this.isButton = false
        }

        this.hidden = false
        UIElement.instances.push(this)
    }

    public OnClick() {
        if (!this.hidden && this.isButton) {
            this.onClick()
        }
    }

    public Hide() {
        this.hidden = true
        this.sprite.setFlag(SpriteFlag.Invisible, true)
    }

    public Show() {
        this.hidden = false
        this.sprite.setFlag(SpriteFlag.Invisible, false)
    }

    public SetPosition(x: number, y: number) {
        this.sprite.setPosition(x, y)
        this.boundingBox.CalculateBoundingBox(this.sprite)
    }
}

class BoundingBox {
    public xMin: number
    public xMax: number
    public yMin: number
    public yMax: number

    constructor(sprite?: Sprite, xMin?: number, xMax?: number, yMin?: number, yMax?: number) {
        if (!xMin || !xMax || !yMin || !yMax) {
            this.CalculateBoundingBox(sprite)
        } else {
            this.xMin = xMin
            this.xMax = xMax
            this.yMin = yMin
            this.yMax = yMax
        }
    }

    public CalculateBoundingBox(sprite: Sprite) {
        this.xMin = sprite.x - (sprite.width / 2)
        this.xMax = sprite.x + (sprite.width / 2)
        this.yMin = sprite.y - (sprite.height / 2)
        this.yMax = sprite.y + (sprite.height / 2)
    }

    public IsPositionInBoundingBox(x: number, y: number): boolean {
        return (x > this.xMin && x < this.xMax) && (y > this.yMin && y < this.yMax)
    }
}

namespace UILibrary {
    browserEvents.MouseLeft.onEvent(browserEvents.MouseButtonEvent.Pressed, function (x: number, y: number) {
        for (let item of UIElement.instances) {
            if (item.boundingBox.IsPositionInBoundingBox(x, y)) {
                item.OnClick()
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