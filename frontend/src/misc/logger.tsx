// logger.ts
interface LogData {
  message: string;
  level?: "debug" | "info" | "warn" | "error";
  [key: string]: any;
}

export const logger = {
  info: (message: string, data?: Record<string, any>) =>
    sendLog({ message, level: "info", ...data }),

  error: (message: string, data?: Record<string, any>) =>
    sendLog({ message, level: "error", ...data }),

  warn: (message: string, data?: Record<string, any>) =>
    sendLog({ message, level: "warn", ...data }),

  debug: (message: string, data?: Record<string, any>) =>
    sendLog({ message, level: "debug", ...data }),
};

const sendLog = async (data: LogData) => {
  const { message, level, ...additionalFields } = data;

  const customFields: Record<string, any> = {};
  for (const [key, value] of Object.entries(additionalFields)) {
    customFields[`_${key}`] = value;
  }

  const payload = {
    version: "1.1",
    host: "slice-frontend",
    short_message: message,
    level: getLevelNumber(level || "info"),
    ...customFields,
  };

  console.debug("Sending to Graylog:", payload);

  try {
    const response = await fetch("http://localhost:12202/gelf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.debug("Graylog response:", response.status);
  } catch (err) {
    console.error("Failed to send log to Graylog:", err);
  }
};

const getLevelNumber = (level: string): number => {
  const levels: Record<string, number> = {
    debug: 7,
    info: 6,
    warn: 4,
    error: 3,
  };
  return levels[level] || 6;
};
