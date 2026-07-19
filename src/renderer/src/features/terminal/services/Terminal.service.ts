export const executeTerminalCommand = async (commandStr: string): Promise<boolean> => {
  try {
    const res = await (window as any).electronAPI.executeTerminalCommand(commandStr);
    return res.success;
  } catch (err) {
    console.error("Failed to execute terminal command", err);
    return false;
  }
};

export const onTerminalLog = (callback: (log: any) => void) => {
  if (!(window as any).electronAPI?.onTerminalLog) return () => {};
  return (window as any).electronAPI.onTerminalLog((_event: any, log: any) => {
    callback(log);
  });
};
