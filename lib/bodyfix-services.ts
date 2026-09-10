export type BodyFixService = {
  id: string;
  name: string;
  duration: string;
  price?: string;
  description: string;
  badge?: string;
};

export const BODYFIX_SERVICES: BodyFixService[] = [
  { id: "body-reset", name: "Body Reset", duration: "60 分鐘", price: "NT$2,200", description: "以筋膜線判讀與全身張力分工為主。" },
  { id: "pelvic-core", name: "Pelvic Core Reset", duration: "60 分鐘", price: "NT$2,500", description: "以骨盆、髖、臀、內收與核心周邊張力為主。" },
  { id: "fascia-line", name: "指定筋膜線", duration: "60 分鐘", price: "NT$2,300", description: "適合已知道希望集中整理的特定筋膜線。" },
  { id: "multi-line", name: "多線整合", duration: "90 分鐘", price: "NT$3,600", description: "適合肩背、腰、骨盆、腿等多區域彼此牽連。" },
  { id: "pelvic-vip", name: "Pelvic Core VIP", duration: "120 分鐘", price: "NT$6,800", badge: "VIP · 一天限一名", description: "骨盆核心與多面向深度整合。" },
];

export const MOVEMENT_TRAINING = {
  id: "movement",
  name: "Movement Training",
  planName: "1 對 1 教練方案",
  duration: "60 分鐘",
  singlePrice: "NT$1,800",
  packages: [
    { sessions: "12 堂", price: "NT$20,400" },
    { sessions: "24 堂", price: "NT$38,400" },
    { sessions: "36 堂", price: "NT$54,000" },
    { sessions: "24 堂訓練＋12 次筋膜整理", price: "一次付清 NT$60,000" },
  ],
} as const;

export const LINE_URL = "https://line.me/R/ti/p/@359gzxzi";

export function serviceById(id: string) {
  return BODYFIX_SERVICES.find((service) => service.id === id);
}
