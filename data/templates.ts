import { InfographicData, ChartType } from '../types';

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  thumbnailColor: string;
  data: InfographicData;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 't1',
    name: 'รายงานผลประกอบการไตรมาส',
    description: 'ภาพรวมทางการเงินพร้อมกราฟแท่งและสถิติสำคัญ',
    thumbnailColor: 'bg-blue-500',
    data: {
      title: "ผลประกอบการ ไตรมาส 3 ปี 2567",
      subtitle: "ภาพรวมทางการเงินและตัวชี้วัดสำคัญ",
      themeColor: "#3b82f6",
      backgroundColor: "#ffffff",
      footer: "เอกสารภายใน - ห้ามเผยแพร่",
      sections: [
        {
          id: "s1",
          type: ChartType.STAT,
          title: "ตัวชี้วัดรายได้หลัก",
          data: [
            { name: "รายได้รวม", value: 1250000, label: "+12% ต่อปี" },
            { name: "กำไรสุทธิ", value: 340000, label: "อัตรากำไร 27%" },
            { name: "ลูกค้าใหม่", value: 1450 }
          ]
        },
        {
          id: "s2",
          type: ChartType.BAR,
          title: "รายได้แยกตามแผนก",
          data: [
            { name: "ฝ่ายขาย", value: 500000 },
            { name: "การตลาด", value: 300000 },
            { name: "บริการ", value: 450000 }
          ]
        },
        {
          id: "s3",
          type: ChartType.PIE,
          title: "สัดส่วนค่าใช้จ่าย",
          data: [
            { name: "เงินเดือน", value: 60 },
            { name: "วิจัยและพัฒนา", value: 25 },
            { name: "การตลาด", value: 15 }
          ]
        }
      ]
    }
  },
  {
    id: 't2',
    name: 'สิ่งแวดล้อมและความยั่งยืน',
    description: 'เทมเพลตสีเขียวสำหรับสถิติด้านสิ่งแวดล้อม',
    thumbnailColor: 'bg-emerald-500',
    data: {
      title: "เป้าหมายความยั่งยืน 2030",
      subtitle: "เส้นทางสู่การปล่อยคาร์บอนสุทธิเป็นศูนย์ของเรา",
      themeColor: "#10b981",
      backgroundColor: "#ecfdf5",
      footer: "ที่มา: รายงานความยั่งยืนประจำปี 2567",
      sections: [
        {
          id: "s1",
          type: ChartType.PIE,
          title: "แหล่งที่มาของคาร์บอนฟุตพริ้นท์",
          data: [
            { name: "การผลิต", value: 45 },
            { name: "โลจิสติกส์", value: 30 },
            { name: "สำนักงาน", value: 10 },
            { name: "อื่นๆ", value: 15 }
          ]
        },
        {
          id: "s2",
          type: ChartType.LIST,
          title: "โครงการสำคัญ",
          data: [
            { name: "ติดตั้งโซลาร์เซลล์", value: 0, label: "ครอบคลุม 80% ของหลังคาโกดัง" },
            { name: "เปลี่ยนรถขนส่งเป็น EV", value: 0, label: "ทดแทนรถดีเซล 50 คัน" },
            { name: "นโยบายขยะเหลือศูนย์", value: 0, label: "รีไซเคิลขยะการผลิต 95%" }
          ]
        }
      ]
    }
  },
  {
    id: 't3',
    name: 'วิเคราะห์โซเชียลมีเดีย',
    description: 'เทมเพลตสีสันสดใสสำหรับการมีส่วนร่วมและการเติบโต',
    thumbnailColor: 'bg-pink-500',
    data: {
      title: "การมีส่วนร่วมบนโซเชียลมีเดีย",
      subtitle: "ผลลัพธ์แคมเปญ: โปรโมชั่นต้อนรับฤดูร้อน",
      themeColor: "#ec4899",
      backgroundColor: "#fff1f2",
      sections: [
        {
          id: "s1",
          type: ChartType.LINE,
          title: "การเติบโตของผู้ติดตาม (7 วันล่าสุด)",
          data: [
            { name: "จันทร์", value: 10200 },
            { name: "อังคาร", value: 10350 },
            { name: "พุธ", value: 10600 },
            { name: "พฤหัส", value: 10800 },
            { name: "ศุกร์", value: 11200 },
            { name: "เสาร์", value: 11500 },
            { name: "อาทิตย์", value: 11900 }
          ]
        },
        {
          id: "s2",
          type: ChartType.STAT,
          title: "อัตราการมีส่วนร่วม",
          data: [
            { name: "ไลก์", value: 45200 },
            { name: "แชร์", value: 8900 },
            { name: "คอมเมนต์", value: 3400 }
          ]
        }
      ]
    }
  },
  {
    id: 't4',
    name: 'เปิดตัวสินค้าเทคโนโลยี',
    description: 'เทมเพลตสีเข้ม ทันสมัย สำหรับสเปคสินค้า',
    thumbnailColor: 'bg-slate-800',
    data: {
      title: "เปิดตัว Nexus X1",
      subtitle: "ประสิทธิภาพแห่งอนาคต",
      themeColor: "#6366f1",
      backgroundColor: "#0f172a",
      footer: "ข้อมูลความลับ บริษัท Nexus Corp",
      sections: [
        {
          id: "s1",
          type: ChartType.STAT,
          title: "สเปคหลัก",
          data: [
            { name: "พลังประมวลผล", value: 120, label: "TFLOPS" },
            { name: "แบตเตอรี่", value: 24, label: "ชั่วโมง" },
            { name: "น้ำหนัก", value: 180, label: "กรัม" }
          ]
        },
        {
          id: "s2",
          type: ChartType.BAR,
          title: "เปรียบเทียบประสิทธิภาพ",
          data: [
            { name: "Nexus X1", value: 9500 },
            { name: "คู่แข่ง A", value: 7200 },
            { name: "คู่แข่ง B", value: 6800 }
          ]
        }
      ]
    }
  }
];