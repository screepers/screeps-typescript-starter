const textColor = '#bab8ba';
const textSize = .8;
const charWidth = textSize * 0.4;
const charHeight = textSize * 1.1;

// Helper for room visuals
export default class RoomVisualManager {

    /**
     *
     * @param lines the array of text we want to display
     * @param x the x value we are starting it at
     * @param y the y value we are starting it at
     * @param roomName the room name its going in
     * @param isTitle if there is a title for this block of text
     */
    public static multiLineText(lines: string[], x: number, y: number, roomName: string): void {
        if (lines.length === 0) {
            return;
        }
        const vis = new RoomVisual(roomName);

        // Draw text
        let dy = 0;
        for (const line of lines) {
            vis.text(line, x, y + dy, {
                align: 'left',
                color: textColor,
                opacity: .8,
                font: ' .7 Trebuchet MS'
            });
            dy += charHeight;
        }
    }
}
