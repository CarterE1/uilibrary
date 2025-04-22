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
    private hidden: boolean

    constructor(sprite: Sprite, onClick?: Function) {
        this.sprite = sprite
        this.boundingBox = new BoundingBox(sprite)
        this.hidden = false
        if (onClick != null) {
            this.onClick = onClick
        }
        UIElement.instances.push(this)
    }

    public SetOnClick(onClick: Function) {
        this.onClick = onClick
    }

    public OnClick() {
        if (!this.hidden && this.onClick != null) {
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

class ScrollingFrame {
    static instances: ScrollingFrame[] = []

    public elements: UIElement[]
    public overlapSprite: Sprite

    public horizontalPos: number
    public horizontalSpacing: number
    private scrollValue: number
    public scrollSpeed: number

    private width: number
    private startDragY: number
    private startScrollValue: number
    public isDragging: boolean

    constructor(elements: UIElement[], horizontalPos: number, horizontalSpacing: number, overlapSprite?: Sprite) {
        this.elements = elements
        this.horizontalPos = horizontalPos
        this.horizontalSpacing = horizontalSpacing
        this.scrollValue = 0
        this.scrollSpeed = 3
        this.CalculatePosition()

        ScrollingFrame.instances.push(this)
    }

    public CalculatePosition() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].SetPosition(this.horizontalPos, (i * this.horizontalSpacing) + this.scrollValue)
        }
    }

    public Scroll(input: number) {
        this.scrollValue += input * this.scrollSpeed
        this.CalculatePosition()
        for (let element of this.elements) {
            element.boundingBox.CalculateBoundingBox(element.sprite)
        }
    }

    public CalculateWidth() {
        let max = 0
        for (let element of this.elements) {
            if (element.sprite.width > max) {
                max = element.sprite.width
            }
        }
        this.width = max
    }

    public Drag(curY: number) {
        this.scrollValue = this.startScrollValue + (curY - this.startDragY)
        this.CalculatePosition()
    }

    static StartDrag(x: number, y: number) {
        for (let frame of ScrollingFrame.instances) {
            frame.CalculateWidth()
            if (x > frame.horizontalPos - frame.width / 2 && x < frame.horizontalPos + frame.width / 2) {
                frame.startDragY = y
                frame.startScrollValue = frame.scrollValue
                frame.isDragging = true
                console.log("STARTED DRAG AT " + y)
            }
            console.log(frame.horizontalPos - frame.width / 2 + " --- " + frame.horizontalPos + frame.width / 2)
        }
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