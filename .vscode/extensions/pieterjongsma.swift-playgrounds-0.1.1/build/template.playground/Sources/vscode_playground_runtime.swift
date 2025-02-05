
import Foundation

// Import `stdout`, so we can disable output buffering
#if os(Linux)
  import Glibc
#else
  import Darwin.C
#endif

typealias JSON = [String: Any?]

struct SourceRange {
  let sl: Int
  let el: Int
  let sc: Int
  let ec: Int

  var json: JSON {
    return [
      "sl": sl,
      "el": el,
      "sc": sc,
      "ec": ec
    ]
  }
}

class LogRecord {
  let api: String
  let range: SourceRange
  let object: Any?
  let name: String?
  let id: Int?

  init(api: String, range: SourceRange, object: Any? = nil, name: String? = nil, id: Int? = nil) {
    self.api = api
    self.range = range
    self.object = object
    self.name = name
    self.id = id
  }

  var json: JSON {
    var objectDescription: String?
    if let object = object {
      var description: String = ""
      print(object, terminator: "", to: &description)
      objectDescription = description
    }

    return [
      "api": api,
      "range": range.json,
      "object": objectDescription,
      "name": name,
      "id": id
    ]
  }
}

func __builtin_log<T>(_ object: T, _ name: String, _ sl: Int, _ el: Int, _ sc: Int, _ ec: Int) -> AnyObject? {
  return LogRecord(api:"builtin_log", range: SourceRange(sl:sl, el:el, sc:sc, ec:ec), object: object, name: name)
}

func __builtin_log_with_id<T>(_ object: T, _ name: String, _ id: Int, _ sl: Int, _ el: Int, _ sc: Int, _ ec: Int) -> AnyObject? {
  return LogRecord(api:"builtin_log", range: SourceRange(sl:sl, el:el, sc:sc, ec:ec), object: object, name: name, id: id)
}

func __builtin_log_scope_entry(_ sl: Int, _ el: Int, _ sc: Int, _ ec: Int) -> AnyObject? {
  return LogRecord(api:"builtin_log_scope_entry", range: SourceRange(sl:sl, el:el, sc:sc, ec:ec))
}

func __builtin_log_scope_exit(_ sl: Int, _ el: Int, _ sc: Int, _ ec: Int) -> AnyObject? {
  return LogRecord(api:"builtin_log_scope_exit", range: SourceRange(sl:sl, el:el, sc:sc, ec:ec))
}

func __builtin_postPrint(_ sl: Int, _ el: Int, _ sc: Int, _ ec: Int) -> AnyObject? {
  // Prevent stdout from being buffered until the end of execution
  #if stdout
    fflush(stdout)
  #endif
  #if stderr
    fflush(stderr)
  #endif
  
  return LogRecord(api:"builtin_postPrint", range: SourceRange(sl:sl, el:el, sc:sc, ec:ec))
}

func __builtin_send_data(_ object: AnyObject?) {
  if let record = object as? LogRecord {
    guard let data = try? JSONSerialization.data(withJSONObject: record.json, options: []) else {
      print("Failed to serialize log record")
      return
    }
    
    let handle = FileHandle(fileDescriptor: 3)
    handle.write(data)

    let lineBreak = "\n".data(using: .utf8)!
    handle.write(lineBreak)
  }
}
