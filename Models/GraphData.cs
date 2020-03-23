using System;
using System.Linq;
using System.Collections.Generic;

namespace thing.Models
{
  public class DataPoint<T> {
    // Really a string, but we're doing date so we can work with it easier
    // public string name;
    public T name;
    public decimal value;
  }

  public class DataSet<T> {
    public string name;
    public List<DataPoint<T>> series;
  }
}
