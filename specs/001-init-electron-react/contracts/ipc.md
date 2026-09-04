# Contracts: IPC (Inter-Process Communication)

## `window.electron`
- **Type**: Context bridge API exposed via the `preload` script.

### Methods

#### `ping`
- **Direction**: Renderer -> Main
- **Arguments**: None
- **Returns**: `Promise<string>`
- **Description**: Sends a ping message to the main process to verify IPC connectivity. The main process must reply with a predefined string (e.g., "pong from main").
