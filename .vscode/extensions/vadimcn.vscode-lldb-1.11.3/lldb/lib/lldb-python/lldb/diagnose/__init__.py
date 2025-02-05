__all__ = ["diagnose_unwind", "diagnose_nsstring"]
for x in __all__:
  __import__('lldb.diagnose.' + x)

def __lldb_init_module(debugger, internal_dict):
  import lldb
  for x in __all__:
    submodule = getattr(lldb.diagnose, x)
    lldb_init = getattr(submodule, '__lldb_init_module', None)
    if lldb_init:
      lldb_init(debugger, internal_dict)
