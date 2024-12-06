export type Thread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type Paste = {
  id: string;
  threadId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

// 如果需要创建新记录时使用的类型（不包含自动生成的字段）
export type CreateThreadInput = {
  title: string;
};

export type CreatePasteInput = {
  threadId: string;
  content: string;
};
