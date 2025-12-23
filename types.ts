export enum ChartType {
  BAR = 'bar',
  PIE = 'pie',
  LINE = 'line',
  STAT = 'stat',
  LIST = 'list'
}

export interface DataPoint {
  name: string;
  value: number;
  label?: string; // For list items or extra context
}

export interface Section {
  id: string;
  type: ChartType;
  title: string;
  description?: string;
  chartDescription?: string;
  data: DataPoint[];
  config?: {
    color?: string;
    layout?: 'horizontal' | 'vertical';
  };
}

export interface InfographicData {
  title: string;
  subtitle: string;
  themeColor: string;
  backgroundColor: string;
  sections: Section[];
  footer?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
}