using System;
using System.Linq;
using System.Collections.Generic;

namespace thing.Models
{
  public class DataPoint {
    // Really a string, but we're doing date so we can work with it easier
    // public string name;
    public DateTime name;
    public decimal value;
  }

  public class DataSet {
    public string name;
    public List<DataPoint> series;
  }
}
