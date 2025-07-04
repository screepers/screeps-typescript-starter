export function err(message: string, throwError: boolean): void {
  if (throwError) {
    throw new Error(message);
  } else {
    console.log(`<span style="color: #ff0000">${message}</span>`);
  }
}

export function warn(message: string): void {
  console.log(`<span style="color: #ffff00">${message}</span>`);
}

export function info(message: string): void {
  console.log(`<span style="color: #00ff00">${message}</span>`);
}
