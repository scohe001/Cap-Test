/*
public class DataPoint {
    public string name;
    public decimal value;
  }

  public class DataSet {
    public string name;
    public List<DataPoint> series;
  }
  */

export interface DataPoint {
  // name: string;
  name: Date;
  value: number;
}

export interface DataSet {
    name: string;
    series: DataPoint[];
}