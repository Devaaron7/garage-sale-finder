export interface GarageSale {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  imageUrl?: string;
  source: string;
  distance?: number;
  distanceUnit?: string;
  price?: string;
  preview?: string;
  url?: string;
  photoCount?: number;
}

export interface SearchFilters {
  zipCode: string;
  radius: number;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  sources: string[];
}

export interface DataSource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
}
