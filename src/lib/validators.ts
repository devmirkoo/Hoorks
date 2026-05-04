export interface TransactionInput {
  userId: string;
  productId: string;
  gamepassId: string | null;
  isAGift: boolean;
  gifterId: string | null;
  amount: number;
  universeId: string;
  placeId: string;
  transactionId: string;
  timestamp: string;
  itemType: "Gamepass" | "DeveloperProduct";
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  data?: TransactionInput;
}

export function validateTransaction(body: unknown): ValidationResult {
  const errors: string[] = [];

  if (!body || typeof body !== "object") {
    return { valid: false, errors: ["Request body must be a JSON object"] };
  }

  const data = body as Record<string, unknown>;

  // Required string fields
  const requiredStrings = [
    "userId",
    "productId",
    "universeId",
    "placeId",
    "transactionId",
    "timestamp",
  ] as const;

  for (const field of requiredStrings) {
    if (!data[field] || typeof data[field] !== "string") {
      errors.push(`"${field}" is required and must be a string`);
    }
  }

  // Amount must be a number
  if (data.amount === undefined || typeof data.amount !== "number") {
    errors.push('"amount" is required and must be a number');
  } else if (data.amount < 0) {
    errors.push('"amount" must be non-negative');
  }

  // isAGift must be a boolean
  if (data.isAGift === undefined || typeof data.isAGift !== "boolean") {
    errors.push('"isAGift" is required and must be a boolean');
  }

  // Optional nullable strings
  if (
    data.gamepassId !== undefined &&
    data.gamepassId !== null &&
    typeof data.gamepassId !== "string"
  ) {
    errors.push('"gamepassId" must be a string or null');
  }

  if (
    data.gifterId !== undefined &&
    data.gifterId !== null &&
    typeof data.gifterId !== "string"
  ) {
    errors.push('"gifterId" must be a string or null');
  }

  // Validate timestamp format (basic ISO 8601 check)
  if (typeof data.timestamp === "string") {
    const date = new Date(data.timestamp);
    if (isNaN(date.getTime())) {
      errors.push('"timestamp" must be a valid ISO 8601 date string');
    }
  }

  // itemType must be "Gamepass" or "DeveloperProduct"
  const validItemTypes = ["Gamepass", "DeveloperProduct"];
  if (!data.itemType || typeof data.itemType !== "string" || !validItemTypes.includes(data.itemType)) {
    errors.push('"itemType" is required and must be "Gamepass" or "DeveloperProduct"');
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    data: {
      userId: data.userId as string,
      productId: data.productId as string,
      gamepassId: (data.gamepassId as string | null) || null,
      isAGift: data.isAGift as boolean,
      gifterId: (data.gifterId as string | null) || null,
      amount: data.amount as number,
      universeId: data.universeId as string,
      placeId: data.placeId as string,
      transactionId: data.transactionId as string,
      timestamp: data.timestamp as string,
      itemType: data.itemType as "Gamepass" | "DeveloperProduct",
    },
  };
}
