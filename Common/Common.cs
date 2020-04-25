using System;
using System.Globalization;

namespace CreditCache.Common
{
  // Not really needed just yet...
  // public class Common
  // {
  //   public Common() { }
  // }

  public class NotFoundException: Exception {
    public NotFoundException() : base() { }
    public NotFoundException(string msg) : base(msg) { }
  }

  public class ForbiddenException: Exception {
    public ForbiddenException() : base() { }
    public ForbiddenException(string msg) : base(msg) { }
  }
}
